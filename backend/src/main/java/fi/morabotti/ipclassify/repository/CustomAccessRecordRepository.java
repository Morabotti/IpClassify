package fi.morabotti.ipclassify.repository;

import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.aggregations.Aggregation;
import co.elastic.clients.elasticsearch._types.aggregations.FieldDateMath;
import co.elastic.clients.util.NamedValue;
import fi.morabotti.ipclassify.domain.AccessRecord;
import fi.morabotti.ipclassify.domain.LocationRecord;
import fi.morabotti.ipclassify.dto.AccessSummary;
import fi.morabotti.ipclassify.dto.TrafficLevel;
import fi.morabotti.ipclassify.dto.TrafficSummary;
import fi.morabotti.ipclassify.dto.common.Pagination;
import fi.morabotti.ipclassify.dto.query.AccessRecordQuery;
import fi.morabotti.ipclassify.dto.query.AggregationQuery;
import fi.morabotti.ipclassify.dto.query.CommonQuery;
import fi.morabotti.ipclassify.dto.query.DateQuery;
import fi.morabotti.ipclassify.service.AccessRecordService;
import fi.morabotti.ipclassify.util.AggregationUtility;
import fi.morabotti.ipclassify.util.QueryUtility;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.client.elc.NativeQueryBuilder;
import org.springframework.data.elasticsearch.core.ReactiveSearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.query.Criteria;
import org.springframework.data.elasticsearch.core.query.CriteriaQuery;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.util.annotation.Nullable;

import java.time.Instant;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class CustomAccessRecordRepository {
    private final ReactiveSearchOperations reactiveSearchOperations;

    public Mono<Pagination<AccessRecord>> getPaginated(
            Pageable pageable,
            DateQuery date,
            CommonQuery common,
            AccessRecordQuery query
    ) {
        CriteriaQuery criteriaQuery = new CriteriaQuery(QueryUtility.toCriteria("createdAt", date));
        QueryUtility.applyToQuery(criteriaQuery, QueryUtility.commonToAccessRecordCriteriaChain(common));
        QueryUtility.applyToQuery(criteriaQuery, QueryUtility.toCriteriaChain(query));

        NativeQueryBuilder queryBuilder = NativeQuery.builder()
                .withQuery(criteriaQuery);

        NativeQuery withPaging = queryBuilder
                .withPageable(pageable)
                .build();

        Mono<List<AccessRecord>> result = reactiveSearchOperations.search(withPaging, AccessRecord.class)
                    .map(SearchHit::getContent)
                    .collectList();

        Mono<Long> count = reactiveSearchOperations.count(queryBuilder.build(), AccessRecord.class);

        return Mono.zip(result, count)
                .map(tuple -> Pagination.<AccessRecord>builder()
                        .result(tuple.getT1())
                        .count(tuple.getT2())
                        .build());
    }

    public Flux<TrafficSummary> getBackTrackedRecords(Long size) {
        Instant now = Instant.now().minusSeconds(AccessRecordService.FETCH_INTERVAL);
        Instant startTime = now.minusSeconds(
                (size * AccessRecordService.FETCH_INTERVAL) - AccessRecordService.FETCH_INTERVAL
        );

        Query query = new NativeQueryBuilder()
                .withQuery(new CriteriaQuery(
                        Criteria.where("processedAt")
                                .greaterThanEqual(startTime)
                                .lessThanEqual(now))
                )
                .withAggregation(
                        "time_buckets",
                        Aggregation.of(builder -> builder
                                .dateHistogram(d -> d
                                        .field("createdAt")
                                        .fixedInterval(t -> t.time(AccessRecordService.FETCH_INTERVAL + "s"))
                                        .order(List.of(NamedValue.of("_key", SortOrder.Asc)))
                                        .minDocCount(0)
                                        .extendedBounds(e -> e
                                                .min(FieldDateMath.of(f -> f.value((double)startTime.toEpochMilli())))
                                                .max(FieldDateMath.of(f -> f.value((double)now.toEpochMilli())))
                                        )
                                )
                                .aggregations("danger", Aggregation.of(sub -> sub
                                        .filter(f -> f.term(t -> t
                                                .field("danger")
                                                .value(true)))))
                                .aggregations("warning", Aggregation.of(sub -> sub
                                        .filter(f -> f.term(t -> t
                                                .field("warning")
                                                .value(true)))))
                                .aggregations("normal", Aggregation.of(sub -> sub
                                        .filter(f -> f.bool(b -> b
                                                .mustNot(m -> m.term(t -> t
                                                        .field("warning")
                                                        .value(true)))
                                                .mustNot(m -> m.term(t -> t
                                                        .field("danger")
                                                        .value(true))))
                                        ))
                                )
                        )
                )
                .build();

        return reactiveSearchOperations.aggregate(query, AccessRecord.class)
                .flatMap(AggregationUtility::formatDateHistogramAggregation)
                .map(bucket -> TrafficSummary.builder()
                            .time(Instant.ofEpochMilli(bucket.key()))
                            .danger(bucket.aggregations().get("danger").filter().docCount())
                            .warning(bucket.aggregations().get("warning").filter().docCount())
                            .normal(bucket.aggregations().get("normal").filter().docCount())
                            .build()
                );
    }

    public Flux<AccessSummary> getMostCommonAggregatedBy(
            DateQuery date,
            AggregationQuery aggregation,
            @Nullable TrafficLevel level
    ) {
        return reactiveSearchOperations.aggregate(
                getCommonRecordsQuery(date, aggregation, level),
                AccessRecord.class
        )
                .flatMap(AggregationUtility::formatStringTermAggregation)
                .map(i -> AccessSummary.builder()
                        .label(i.key().stringValue())
                        .count(i.docCount())
                        .level(level)
                        .build());
    }

    public Mono<List<String>> getDistinctBy(String key) {
        NativeQuery query = new NativeQueryBuilder()
                .withAggregation(
                        "distinct_values",
                        Aggregation.of(
                                a -> a.terms(t -> t.field(key).size(1000))
                        )
                )
                .build();

        return reactiveSearchOperations.aggregate(query, AccessRecord.class)
                .flatMap(AggregationUtility::formatStringTermAggregation)
                .map(bucket -> bucket.key().stringValue())
                .collectList();
    }

    private Query getCommonRecordsQuery(
            DateQuery dateQuery,
            AggregationQuery aggregation,
            @Nullable TrafficLevel level
    ) {
        CriteriaQuery criteriaQuery = new CriteriaQuery(QueryUtility.toCriteria("createdAt", dateQuery));

        if (level != null) {
            criteriaQuery = criteriaQuery.addCriteria(QueryUtility.toCriteria(level));
        }

        return new NativeQueryBuilder()
                .withQuery(criteriaQuery)
                .withAggregation(
                        String.format("most_common_%s", aggregation.getField()),
                        Aggregation.of(
                                t -> t.terms(
                                        t1 -> t1.field(aggregation.getField())
                                                .size(aggregation.getOptionalCount().orElse(10))
                                )
                        )
                )
                .build();
    }
}
