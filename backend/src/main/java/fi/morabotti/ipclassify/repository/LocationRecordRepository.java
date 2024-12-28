package fi.morabotti.ipclassify.repository;

import fi.morabotti.ipclassify.domain.LocationRecord;
import org.springframework.data.elasticsearch.repository.ReactiveElasticsearchRepository;

public interface LocationRecordRepository extends ReactiveElasticsearchRepository<LocationRecord, String> {
}
