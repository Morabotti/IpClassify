package fi.morabotti.ipclassify.util;

import co.elastic.clients.elasticsearch._types.aggregations.Aggregate;
import co.elastic.clients.elasticsearch._types.aggregations.DateHistogramBucket;
import co.elastic.clients.elasticsearch._types.aggregations.StringTermsBucket;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchAggregation;
import org.springframework.data.elasticsearch.core.AggregationContainer;
import reactor.core.publisher.Flux;

public class AggregationUtility {
    public static Flux<StringTermsBucket> formatStringTermAggregation(AggregationContainer<?> map) {
        ElasticsearchAggregation container = (ElasticsearchAggregation)map;
        Aggregate aggregation = container.aggregation().getAggregate();
        return Flux.fromIterable(aggregation.sterms().buckets().array());
    }

    public static Flux<DateHistogramBucket> formatDateHistogramAggregation(AggregationContainer<?> map) {
        ElasticsearchAggregation container = (ElasticsearchAggregation)map;
        Aggregate aggregation = container.aggregation().getAggregate();
        return Flux.fromIterable(aggregation.dateHistogram().buckets().array());
    }
}
