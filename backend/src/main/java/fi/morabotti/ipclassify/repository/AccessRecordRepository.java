package fi.morabotti.ipclassify.repository;

import fi.morabotti.ipclassify.domain.AccessRecord;
import org.springframework.data.elasticsearch.repository.ReactiveElasticsearchRepository;
import reactor.core.publisher.Mono;

public interface AccessRecordRepository extends ReactiveElasticsearchRepository<AccessRecord, String> {
    Mono<AccessRecord> findByIp(String ip);
}
