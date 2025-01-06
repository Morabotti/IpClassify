package fi.morabotti.ipclassify.service;

import fi.morabotti.ipclassify.client.IpServiceHttpClient;
import fi.morabotti.ipclassify.domain.LocationRecord;
import fi.morabotti.ipclassify.dto.RecordMetadata;
import fi.morabotti.ipclassify.mapper.IpServiceMapper;
import fi.morabotti.ipclassify.repository.CustomAccessRecordRepository;
import fi.morabotti.ipclassify.repository.CustomLocationRecordRepository;
import fi.morabotti.ipclassify.repository.LocationRecordRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.data.redis.core.ReactiveValueOperations;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.Collections;
import java.util.Set;

@Slf4j
@Service
public class IpLocationService {
    private final IpServiceHttpClient ipServiceHttpClient;
    private final ReactiveValueOperations<String, LocationRecord> cacheOperations;
    private final ReactiveRedisTemplate<String, LocationRecord> cacheTemplate;
    private final LocationRecordRepository locationRecordRepository;
    private final CustomLocationRecordRepository customLocationRecordRepository;
    private final CustomAccessRecordRepository customAccessRecordRepository;

    private static final String REDIS_NAMESPACE = "location";

    public IpLocationService(
            ReactiveRedisTemplate<String, LocationRecord> template,
            IpServiceHttpClient ipServiceHttpClient,
            LocationRecordRepository locationRecordRepository,
            CustomLocationRecordRepository customLocationRecordRepository,
            CustomAccessRecordRepository customAccessRecordRepository
    ) {
        this.ipServiceHttpClient = ipServiceHttpClient;
        this.cacheOperations = template.opsForValue();
        this.cacheTemplate = template;
        this.locationRecordRepository = locationRecordRepository;
        this.customLocationRecordRepository = customLocationRecordRepository;
        this.customAccessRecordRepository = customAccessRecordRepository;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        log.info("Initializing IP location caching");
        reconstructCache().subscribe();
    }

    public Mono<RecordMetadata> getMetadata() {
        return Mono.zip(
                customAccessRecordRepository.getDistinctBy("application"),
                customLocationRecordRepository.getDistinctBy("country"),
                customLocationRecordRepository.getDistinctBy("city"),
                customLocationRecordRepository.getDistinctBy("timezone")
        )
                .map(tuple -> RecordMetadata.builder()
                        .applications(tuple.getT1())
                        .countries(tuple.getT2())
                        .cities(tuple.getT3())
                        .timezones(tuple.getT4())
                        .build());
    }

    public Mono<LocationRecord> getLocationRecord(String ip) {
        return cacheOperations.get(getRedisKey(ip))
                .switchIfEmpty(fetchNewLocationRecord(ip))
                .onErrorResume(e -> {
                    log.error("Error fetching location record for IP: {}", ip, e);
                    return Mono.error(new RuntimeException("Could not fetch IP location", e));
                });
    }

    public Flux<LocationRecord> getLocationRecords(Set<String> ips) {
        return Flux.fromIterable(ips)
                .flatMap(this::getLocationRecord);
    }

    public Mono<LocationRecord> fetchNewLocationRecord(String ip) {
        return ipServiceHttpClient.fetchIpGeolocation(ip)
                .map(location -> IpServiceMapper.map(ip, location))
                .map(this::onInitialize)
                .flatMap(this::addLocationRecord);
    }

    public Mono<LocationRecord> addLocationRecord(LocationRecord record) {
        return locationRecordRepository.save(record)
                .then(cacheOperations.set(getRedisKey(record.getIp()), record))
                .thenReturn(record);
    }


    public Mono<Void> reconstructCache() {
        return cacheTemplate.keys("%s:*".formatted(REDIS_NAMESPACE))
                .flatMap(cacheTemplate::delete)
                .thenMany(locationRecordRepository.findAll())
                .flatMap(record -> cacheOperations.set(getRedisKey(record.getIp()), record))
                .then()
                .doOnSuccess(v -> log.info("Reconstructed cache successfully"))
                .doOnError(e -> log.error("Error reconstructing cache", e));
    }

    private LocationRecord onInitialize(LocationRecord record) {
        return record.toBuilder()
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
    }

    private LocationRecord onUpdate(LocationRecord record) {
        return record.toBuilder()
                .updatedAt(Instant.now())
                .build();
    }

    private String getRedisKey(String ip) {
        return "%s:%s".formatted(REDIS_NAMESPACE, ip);
    }
}
