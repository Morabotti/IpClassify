package fi.morabotti.ipclassify.repository;

import fi.morabotti.ipclassify.domain.AccessRecord;
import org.springframework.data.elasticsearch.repository.ReactiveElasticsearchRepository;

public interface AccessRecordRepository extends ReactiveElasticsearchRepository<AccessRecord, String> {
}
