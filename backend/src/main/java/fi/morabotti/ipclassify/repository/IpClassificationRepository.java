package fi.morabotti.ipclassify.repository;

import fi.morabotti.ipclassify.domain.IpClassification;
import fi.morabotti.ipclassify.domain.LocationRecord;
import org.springframework.data.elasticsearch.repository.ReactiveElasticsearchRepository;
import reactor.core.publisher.Mono;

public interface IpClassificationRepository extends ReactiveElasticsearchRepository<IpClassification, String> {
}
