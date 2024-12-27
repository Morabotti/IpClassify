package fi.morabotti.ipclassify.service.consumer;

import fi.morabotti.ipclassify.config.options.KafkaOptions;
import fi.morabotti.ipclassify.domain.RequestMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.kafka.receiver.KafkaReceiver;
import reactor.kafka.receiver.ReceiverOptions;

import java.util.Collections;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class RequestMessageConsumer {
    private final ReceiverOptions<String, RequestMessage> receiverOptions;

    public Flux<List<RequestMessage>> consume() {
        return KafkaReceiver.create(
                receiverOptions.subscription(Collections.singletonList(KafkaOptions.REQUEST_MESSAGE_TOPIC))
        )
                .receiveAutoAck()
                .flatMap(batch -> batch
                        .collectList()
                        .flatMap(this::processBatch));
    }

    private Mono<List<RequestMessage>> processBatch(
            List<ConsumerRecord<String, RequestMessage>> records
    ) {
        List<RequestMessage> messages = records.stream()
                .map(ConsumerRecord::value)
                .toList();

        return Mono.just(messages)
                .doOnNext(batch -> batch.forEach(message -> log.info("Processing message: {}", message)))
                .doOnSuccess(batch -> log.info("Batch successfully processed"));
    }
}
