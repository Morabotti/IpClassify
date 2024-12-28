package fi.morabotti.ipclassify.repository;

import fi.morabotti.ipclassify.domain.AccessRecord;
import fi.morabotti.ipclassify.dto.common.Pagination;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ReactiveSearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;
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
}
