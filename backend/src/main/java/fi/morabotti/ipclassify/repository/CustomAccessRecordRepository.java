package fi.morabotti.ipclassify.repository;

import co.elastic.clients.elasticsearch._types.aggregations.Aggregate;
import co.elastic.clients.elasticsearch._types.aggregations.Aggregation;
import co.elastic.clients.elasticsearch._types.aggregations.BucketMetricValueAggregate;
import co.elastic.clients.elasticsearch._types.aggregations.StringTermsAggregate;
import co.elastic.clients.elasticsearch._types.aggregations.StringTermsBucket;
import co.elastic.clients.elasticsearch._types.aggregations.SumAggregate;
import fi.morabotti.ipclassify.domain.AccessRecord;
import fi.morabotti.ipclassify.domain.IpClassification;
import fi.morabotti.ipclassify.dto.IpSummary;
import fi.morabotti.ipclassify.dto.TrafficSummary;
import fi.morabotti.ipclassify.dto.common.Pagination;
import fi.morabotti.ipclassify.dto.query.DateQuery;
import fi.morabotti.ipclassify.util.AggregationUtility;
import fi.morabotti.ipclassify.util.QueryUtility;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchAggregation;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchAggregations;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.client.elc.NativeQueryBuilder;
import org.springframework.data.elasticsearch.core.AggregationsContainer;
import org.springframework.data.elasticsearch.core.ReactiveSearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
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

    public Mono<Pagination<AccessRecord>> getPaginated(Pageable pageable, DateQuery dateQuery) {
        NativeQueryBuilder queryBuilder = NativeQuery.builder()
                .withQuery(new CriteriaQuery(QueryUtility.toCriteria("createdAt", dateQuery)));

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

    public Flux<AccessRecord> getRecordsFromLastSeconds(Long secondsAgo) {
        Instant oneMinuteAgo = Instant.now().minusSeconds(secondsAgo);

        Query query = new NativeQueryBuilder()
                .withQuery(new CriteriaQuery(Criteria.where("createdAt").greaterThanEqual(oneMinuteAgo)))
                .build();

        return reactiveSearchOperations.search(query, AccessRecord.class)
                .map(SearchHit::getContent);
    }

    public Flux<IpSummary> getCommonRecords(
            DateQuery dateQuery,
            int mostPopular,
            @Nullable TrafficSummary.Level level
    ) {
        CriteriaQuery criteriaQuery = new CriteriaQuery(QueryUtility.toCriteria("createdAt", dateQuery));

        if (level != null) {
            criteriaQuery = criteriaQuery.addCriteria(QueryUtility.toCriteria(level));
        }

        Query query = new NativeQueryBuilder()
                .withQuery(criteriaQuery)
                .withAggregation(
                        "most_common_ip",
                        Aggregation.of(
                                t -> t.terms(
                                        t1 -> t1.field("ip").size(mostPopular)
                                )
                        )
                )
                .build();


        return reactiveSearchOperations.aggregate(query, AccessRecord.class)
                .flatMap(AggregationUtility::formatStringTermAggregation)
                .map(i -> IpSummary.builder()
                        .ip(i.key().stringValue())
                        .count(i.docCount())
                        .level(level)
                        .build());
    }
}
