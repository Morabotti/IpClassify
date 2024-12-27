package fi.morabotti.ipclassify.repository;

import fi.morabotti.ipclassify.domain.LocationRecord;
import org.springframework.data.elasticsearch.repository.ReactiveElasticsearchRepository;
import reactor.core.publisher.Mono;

public interface LocationRecordRepository extends ReactiveElasticsearchRepository<LocationRecord, String> {
}
