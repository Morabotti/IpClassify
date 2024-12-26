package fi.morabotti.ipclassify.controller;

import fi.morabotti.ipclassify.domain.AccessRecord;
import fi.morabotti.ipclassify.repository.AccessRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Instant;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/v1/access-record")
public class AccessRecordController {
    private final AccessRecordRepository accessRecordRepository;

    @GetMapping
    public Flux<AccessRecord> getRecords() {
        return accessRecordRepository.findAll();
    }

    @GetMapping("create")
    public Mono<AccessRecord> createRecord() {
        return Mono.just(AccessRecord.builder()
                .createdAt(Instant.now())
                .ip("192.168.0.1")
                .build()
        )
                .flatMap(accessRecordRepository::save);
    }
}
