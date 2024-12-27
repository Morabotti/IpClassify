package fi.morabotti.ipclassify.service.producer;

import fi.morabotti.ipclassify.config.options.KafkaOptions;
import fi.morabotti.ipclassify.domain.AccessRequestMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.kafka.sender.KafkaSender;
import reactor.kafka.sender.SenderRecord;
import reactor.kafka.sender.SenderResult;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccessRequestMessageProducer {
    private final KafkaSender<String, AccessRequestMessage> kafkaSender;

    public Mono<RecordMetadata> send(AccessRequestMessage message) {
        return kafkaSender.send(Mono.just(createMessage(message)))
                .next()
                .map(SenderResult::recordMetadata)
                .onErrorMap(e -> new RuntimeException("Failed to send message", e));
    }

    public Flux<RecordMetadata> sendAll(Flux<AccessRequestMessage> messages) {
        return kafkaSender.send(messages.map(this::createMessage))
                .map(SenderResult::recordMetadata)
                .onErrorMap(e -> new RuntimeException("Failed to send messages", e));
    }

    private SenderRecord<String, AccessRequestMessage, String> createMessage(AccessRequestMessage message) {
        return SenderRecord.create(
                KafkaOptions.ACCESS_REQUEST_MESSAGE_TOPIC,
                null,
                null,
                message.getUuid().toString(),
                message,
                message.getUuid().toString()
        );
    }
}
