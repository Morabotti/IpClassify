package fi.morabotti.ipclassify.service.producer;

import fi.morabotti.ipclassify.config.options.KafkaOptions;
import fi.morabotti.ipclassify.domain.RequestMessage;
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
public class RequestMessageProducer {
    private final KafkaSender<String, RequestMessage> kafkaSender;

    public Mono<RecordMetadata> send(RequestMessage message) {
        return kafkaSender.send(Mono.just(createMessage(message)))
                .next()
                .map(SenderResult::recordMetadata)
                .onErrorMap(e -> new RuntimeException("Failed to send message", e));
    }

    public Flux<RecordMetadata> sendAll(Flux<RequestMessage> messages) {
        return kafkaSender.send(messages.map(this::createMessage))
                .map(SenderResult::recordMetadata)
                .onErrorMap(e -> new RuntimeException("Failed to send messages", e));
    }

    private SenderRecord<String, RequestMessage, String> createMessage(RequestMessage message) {
        return SenderRecord.create(
                KafkaOptions.REQUEST_MESSAGE_TOPIC,
                null,
                null,
                message.getUuid().toString(),
                message,
                message.getUuid().toString()
        );
    }
}
