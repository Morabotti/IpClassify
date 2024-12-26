package fi.morabotti.ipclassify.controller;

import fi.morabotti.ipclassify.domain.MyMessage;
import fi.morabotti.ipclassify.service.KafkaProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.stream.Collectors;
import java.util.stream.IntStream;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/v1/kafka")
public class KafkaController {
    private final KafkaProducer kafkaProducer;

    @GetMapping("/publish")
    public Mono<Boolean> publish() {
        return kafkaProducer.sendMessage(new MyMessage("1", "3231"))
                .thenReturn(true)
                .onErrorReturn(false);
    }

    @GetMapping("/batch")
    public Mono<Boolean> batch() {
        return kafkaProducer.sendMessages(
                IntStream.rangeClosed(1, 1000)
                        .mapToObj(i -> new MyMessage("" + i, "content-" + i))
                        .collect(Collectors.toList())
        )
                .then(Mono.fromSupplier(() -> true))
                .onErrorReturn(false);
    }
}
