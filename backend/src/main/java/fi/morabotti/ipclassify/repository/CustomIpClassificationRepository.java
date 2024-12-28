package fi.morabotti.ipclassify.repository;

import fi.morabotti.ipclassify.domain.IpClassification;
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
public class CustomIpClassificationRepository {
    private final ReactiveSearchOperations reactiveSearchOperations;

    public Mono<Pagination<IpClassification>> getPaginated(Pageable pageable) {
        NativeQuery query = NativeQuery.builder()
                .withPageable(pageable)
                .build();

        Mono<List<IpClassification>> result = reactiveSearchOperations.search(query, IpClassification.class)
                .map(SearchHit::getContent)
                .collectList();

        Mono<Long> count = reactiveSearchOperations.count(IpClassification.class);

        return Mono.zip(result, count)
                .map(tuple -> Pagination.<IpClassification>builder()
                        .result(tuple.getT1())
                        .count(tuple.getT2())
                        .build());
    }
}

