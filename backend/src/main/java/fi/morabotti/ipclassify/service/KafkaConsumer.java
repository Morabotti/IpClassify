package fi.morabotti.ipclassify.service;

import fi.morabotti.ipclassify.domain.MyMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.kafka.receiver.KafkaReceiver;
import reactor.kafka.receiver.ReceiverOptions;

import java.time.Duration;
import java.util.Collections;
import java.util.List;

@Service
@Slf4j
public class KafkaConsumer {
    private final ReceiverOptions<String, MyMessage> secondaryReceiverOptions;
    private final ReceiverOptions<String, MyMessage> receiverOptions;

    public KafkaConsumer(
            ReceiverOptions<String, MyMessage> receiverOptions,
            @Qualifier("myMessageSecondaryReceiverOptions") ReceiverOptions<String, MyMessage> secondaryReceiverOptions
    ) {
        this.receiverOptions = receiverOptions;
        this.secondaryReceiverOptions = secondaryReceiverOptions;
    }

    public Flux<Long> countMessagesInIntervals(String topic, Duration interval) {
        return KafkaReceiver.create(
                secondaryReceiverOptions.subscription(Collections.singleton(topic))
        )
                .receiveAutoAck()
                .flatMap(batch -> batch
                        .collectList()
                        .flatMap(Mono::just))
                .flatMapIterable(messages -> messages)
                .window(interval)
                .flatMap(Flux::count);
    }

    public Flux<List<MyMessage>> consumeMessages(String topic) {
        return KafkaReceiver.create(
                receiverOptions.subscription(Collections.singleton(topic))
        )
                .receiveAutoAck()
                .flatMap(batch -> batch
                        .collectList()
                        .flatMap(this::processBatch))
                .doOnNext(messages -> log.info("batch consumed: {}", messages))
                .onErrorContinue((error, item) -> log.error(
                        "Error processing message: {}",
                        error.getMessage())
                );
    }

    private Mono<List<MyMessage>> processBatch(List<ConsumerRecord<String, MyMessage>> records) {
        List<MyMessage> messages = records.stream()
                .map(ConsumerRecord::value)
                .toList();

        return Mono.just(messages)
                .doOnNext(batch -> batch.forEach(message -> log.info("Processing message: {}", message)))
                .doOnSuccess(batch -> log.info("Batch successfully processed"));
    }
}
