package fi.morabotti.ipclassify.repository;

import co.elastic.clients.elasticsearch._types.query_dsl.QueryBuilders;
import fi.morabotti.ipclassify.domain.AccessRecord;
import fi.morabotti.ipclassify.dto.common.Pagination;
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

import java.time.Instant;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class CustomAccessRecordRepository {
    private final ReactiveSearchOperations reactiveSearchOperations;

    public Mono<Pagination<AccessRecord>> getPaginated(Pageable pageable) {
        NativeQuery query = NativeQuery.builder()
                .withPageable(pageable)
                .build();

        Mono<List<AccessRecord>> result = reactiveSearchOperations.search(query, AccessRecord.class)
                    .map(SearchHit::getContent)
                    .collectList();

        Mono<Long> count = reactiveSearchOperations.count(AccessRecord.class);

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
}
