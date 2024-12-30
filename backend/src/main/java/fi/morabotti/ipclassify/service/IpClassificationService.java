package fi.morabotti.ipclassify.service;

import fi.morabotti.ipclassify.domain.IpClassification;
import fi.morabotti.ipclassify.dto.IpClassifyRequest;
import fi.morabotti.ipclassify.dto.common.Pagination;
import fi.morabotti.ipclassify.dto.query.PaginationQuery;
import fi.morabotti.ipclassify.dto.query.SortQuery;
import fi.morabotti.ipclassify.repository.AccessRecordRepository;
import fi.morabotti.ipclassify.repository.CustomIpClassificationRepository;
import fi.morabotti.ipclassify.repository.IpClassificationRepository;
import fi.morabotti.ipclassify.util.QueryUtility;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.data.redis.core.ReactiveValueOperations;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Set;

@Slf4j
@Service
public class IpClassificationService {
    private final ReactiveValueOperations<String, IpClassification> cacheOperations;
    private final ReactiveRedisTemplate<String, IpClassification> cacheTemplate;
    private final IpClassificationRepository ipClassificationRepository;
    private final CustomIpClassificationRepository customIpClassificationRepository;
    private final AccessRecordRepository accessRecordRepository;

    private static final String REDIS_NAMESPACE = "classification";

    public IpClassificationService(
            ReactiveRedisTemplate<String, IpClassification> template,
            IpClassificationRepository ipClassificationRepository,
            CustomIpClassificationRepository customIpClassificationRepository,
            AccessRecordRepository accessRecordRepository
    ) {
        this.cacheOperations = template.opsForValue();
        this.cacheTemplate = template;
        this.ipClassificationRepository = ipClassificationRepository;
        this.customIpClassificationRepository = customIpClassificationRepository;
        this.accessRecordRepository = accessRecordRepository;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        log.info("Initializing IP classification caching");
        reconstructCache().subscribe();
    }

    public Mono<Pagination<IpClassification>> getPagination(
            PaginationQuery pagination,
            SortQuery sort
    ) {
        return customIpClassificationRepository.getPaginated(QueryUtility.toPageable(pagination, sort));
    };

    public Mono<IpClassification> getIpClassification(String ip) {
        return cacheOperations.get(getRedisKey(ip))
                .defaultIfEmpty(IpClassification.empty(ip));
    }

    public Flux<IpClassification> getIpClassifications(Set<String> ips) {
        return Flux.fromIterable(ips)
                .flatMap(ip -> cacheOperations.get(getRedisKey(ip))
                        .defaultIfEmpty(IpClassification.empty(ip)));
    }

    public Mono<IpClassification> upsertIpClassification(IpClassification classification) {
        return ipClassificationRepository.save(classification)
                .then(cacheOperations.set(getRedisKey(classification.getIp()), classification))
                .thenReturn(classification);
    }

    public Mono<IpClassification> update(IpClassifyRequest request) {
        if (!request.isValid()) {
            return Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request parameters are invalid"));
        }

        // Only update one record
        if (request.getId() != null) {
            return accessRecordRepository.findById(request.getId())
                    .map(i -> i.update(request.getLevel()))
                    .flatMap(accessRecordRepository::save)
                    .then(getIpClassification(request.getIp()));
        }

        return this.getIpClassification(request.getIp())
                .map(i -> i.update(request.getLevel()))
                .flatMap(this::upsertIpClassification)
                .flatMap(classification -> request.getUpdateHistory()
                        ? accessRecordRepository.findAllByIp(request.getIp())
                                .map(record -> record.update(request.getLevel()))
                                .buffer(2500)
                                .flatMap(accessRecordRepository::saveAll)
                                .then(Mono.just(classification))
                        : Mono.just(classification)
                );
    }

    public Mono<Void> reconstructCache() {
        return cacheTemplate.keys("%s:*".formatted(REDIS_NAMESPACE))
                .flatMap(cacheTemplate::delete)
                .thenMany(ipClassificationRepository.findAll())
                .flatMap(i -> cacheOperations.set(getRedisKey(i.getIp()), i))
                .then()
                .doOnSuccess(v -> log.info("Reconstructed cache successfully"))
                .doOnError(e -> log.error("Error reconstructing cache", e));
    }

    private String getRedisKey(String ip) {
        return "%s:%s".formatted(REDIS_NAMESPACE, ip);
    }
}
