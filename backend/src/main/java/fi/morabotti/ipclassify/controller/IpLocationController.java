package fi.morabotti.ipclassify.controller;

import fi.morabotti.ipclassify.domain.AccessRecord;
import fi.morabotti.ipclassify.domain.IpClassification;
import fi.morabotti.ipclassify.domain.LocationRecord;
import fi.morabotti.ipclassify.repository.AccessRecordRepository;
import fi.morabotti.ipclassify.service.IpClassificationService;
import fi.morabotti.ipclassify.service.IpLocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Instant;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/v1/ip-location")
public class IpLocationController {
    private final IpLocationService ipLocationService;
    private final IpClassificationService ipClassificationService;

    @GetMapping("/{ip}")
    public Mono<LocationRecord> getLocation(@PathVariable String ip) {
        return ipLocationService.getLocationRecord(ip);
    }

    @GetMapping("/classify/{ip}")
    public Mono<IpClassification> getClassification(@PathVariable String ip) {
        return ipClassificationService.getIpClassification(ip);
    }

    @PostMapping("/classify/{ip}")
    public Mono<IpClassification> insertClassification(@PathVariable String ip) {
        return ipClassificationService.upsertIpClassification(IpClassification.builder()
                .ip(ip)
                .isDanger(true)
                .isWarning(false)
                .build());
    }
}
