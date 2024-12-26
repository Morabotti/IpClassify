package fi.morabotti.ipclassify.service;

import fi.morabotti.ipclassify.config.options.KafkaOptions;
import fi.morabotti.ipclassify.domain.MyMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.kafka.sender.KafkaSender;
import reactor.kafka.sender.SenderRecord;
import reactor.kafka.sender.SenderResult;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaProducer {
    private final KafkaSender<String, MyMessage> kafkaSender;

    public Mono<RecordMetadata> sendMessage(MyMessage message) {
        return kafkaSender.send(Mono.just(createRecord(message)))
                .next()
                .map(SenderResult::recordMetadata)
                .doOnNext(metadata -> {
                    log.info("Message sent to partition {} with offset {}", metadata.partition(), metadata.offset());
                })
                .onErrorMap(ex -> {
                    log.error("Error sending message: {}", ex.getMessage());
                    return new RuntimeException("Failed to send Kafka message", ex);
                });
    }

    public Flux<RecordMetadata> sendMessages(List<MyMessage> messages) {
        if (messages.isEmpty()) {
            return Flux.empty();
        }

        return kafkaSender.send(
                Flux.fromIterable(messages)
                        .map(this::createRecord)
        )
                .map(SenderResult::recordMetadata)
                .doOnNext(metadata -> {
                    log.info("Message sent to partition {} with offset {}", metadata.partition(), metadata.offset());
                })
                .onErrorMap(ex -> {
                    log.error("Error sending message: {}", ex.getMessage());
                    return new RuntimeException("Failed to send Kafka message", ex);
                });
    }

    private SenderRecord<String, MyMessage, String> createRecord(MyMessage message) {
        return SenderRecord.create(
                KafkaOptions.EXAMPLE_TOPIC,
                null,
                null,
                message.getId(),
                message,
                message.getId()
        );
    }
}
