package fi.morabotti.ipclassify.controller;

import fi.morabotti.ipclassify.dto.MockTrafficRequest;
import fi.morabotti.ipclassify.service.AccessLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/v1/traffic")
public class TrafficController {
    private final AccessLogService accessLogService;

    @PostMapping
    public Mono<Boolean> create(@RequestBody MockTrafficRequest request){
        return accessLogService.log(request);
    }
}
