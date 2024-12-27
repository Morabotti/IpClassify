package fi.morabotti.ipclassify.service;

import fi.morabotti.ipclassify.domain.IpClassification;
import fi.morabotti.ipclassify.repository.IpClassificationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.data.redis.core.ReactiveValueOperations;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Slf4j
@Service
public class IpClassificationService {
    private final ReactiveValueOperations<String, IpClassification> cacheOperations;
    private final ReactiveRedisTemplate<String, IpClassification> cacheTemplate;
    private final IpClassificationRepository ipClassificationRepository;

    private static final String REDIS_NAMESPACE = "classification";

    public IpClassificationService(
            ReactiveRedisTemplate<String, IpClassification> template,
            IpClassificationRepository ipClassificationRepository
    ) {
        this.cacheOperations = template.opsForValue();
        this.cacheTemplate = template;
        this.ipClassificationRepository = ipClassificationRepository;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        log.info("Initializing IP classification caching");
        reconstructCache().subscribe();
    }

    public Mono<IpClassification> getIpClassification(String ip) {
        return cacheOperations.get(getRedisKey(ip))
                .defaultIfEmpty(IpClassification.empty(ip));
    }

    public Mono<IpClassification> upsertIpClassification(IpClassification classification) {
        return ipClassificationRepository.save(classification)
                .then(cacheOperations.set(getRedisKey(classification.getIp()), classification))
                .thenReturn(classification);
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
