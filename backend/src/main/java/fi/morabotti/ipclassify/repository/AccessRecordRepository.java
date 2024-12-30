package fi.morabotti.ipclassify.repository;

import fi.morabotti.ipclassify.domain.AccessRecord;
import org.springframework.data.elasticsearch.repository.ReactiveElasticsearchRepository;
import reactor.core.publisher.Flux;

public interface AccessRecordRepository extends ReactiveElasticsearchRepository<AccessRecord, String> {
    Flux<AccessRecord> findAllByIp(String ip);
}
