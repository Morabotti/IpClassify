package fi.morabotti.ipclassify.repository;

import co.elastic.clients.elasticsearch._types.aggregations.Aggregation;
import fi.morabotti.ipclassify.domain.LocationRecord;
import fi.morabotti.ipclassify.util.AggregationUtility;
import lombok.RequiredArgsConstructor;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.client.elc.NativeQueryBuilder;
import org.springframework.data.elasticsearch.core.ReactiveSearchOperations;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class CustomLocationRecordRepository {
    private final ReactiveSearchOperations reactiveSearchOperations;

    public Mono<List<String>> getDistinctBy(String key) {
        NativeQuery query = new NativeQueryBuilder()
                .withAggregation(
                        "distinct_values",
                        Aggregation.of(
                                a -> a.terms(
                                        t -> t.field(key)
                                                .size(1000)
                                )
                        )
                )
                .build();

        return reactiveSearchOperations.aggregate(query, LocationRecord.class)
                .flatMap(AggregationUtility::formatStringTermAggregation)
                .map(bucket -> bucket.key().stringValue())
                .collectList();
    }
}

