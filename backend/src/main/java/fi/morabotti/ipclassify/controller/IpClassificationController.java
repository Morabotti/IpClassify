package fi.morabotti.ipclassify.controller;

import fi.morabotti.ipclassify.domain.IpClassification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.data.redis.core.ReactiveValueOperations;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping(value = "/api/v1/ip-classification")
public class IpClassificationController {
    private final ReactiveValueOperations<String, IpClassification> reactiveValueOps;

    @Autowired
    public IpClassificationController(ReactiveRedisTemplate<String, IpClassification> template) {
        this.reactiveValueOps = template.opsForValue();
    }

    @GetMapping
    public Mono<IpClassification> getIpClassification() {
        return reactiveValueOps.get("ip:1");
    }

    @GetMapping("create")
    public Mono<IpClassification> createIpClassification() {
        return Mono.just(IpClassification.builder()
                .ip("192.168.0.1")
                .isDanger(true)
                .isWarning(false)
                .build()
        )
                .flatMap(set -> reactiveValueOps.set("ip:1", set).thenReturn(set));
    }
}
