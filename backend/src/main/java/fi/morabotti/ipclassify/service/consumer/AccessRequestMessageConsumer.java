package fi.morabotti.ipclassify.service.consumer;

import fi.morabotti.ipclassify.config.options.KafkaOptions;
import fi.morabotti.ipclassify.domain.AccessRecord;
import fi.morabotti.ipclassify.domain.AccessRequestMessage;
import fi.morabotti.ipclassify.dto.TrafficSummary;
import fi.morabotti.ipclassify.mapper.RequestMessageMapper;
import fi.morabotti.ipclassify.repository.AccessRecordRepository;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.kafka.receiver.KafkaReceiver;
import reactor.kafka.receiver.ReceiverOptions;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@Slf4j
public class AccessRequestMessageConsumer {
    private final ReceiverOptions<String, AccessRequestMessage> receiverOptions;
    private final AccessRecordRepository accessRecordRepository;
    private final ReceiverOptions<String, AccessRequestMessage> analysisReceiverOptions;

    private final static Set<String> SUBSCRIPTIONS = Set.of(KafkaOptions.ACCESS_REQUEST_MESSAGE_TOPIC);

    public AccessRequestMessageConsumer(
            ReceiverOptions<String, AccessRequestMessage> receiverOptions,
            AccessRecordRepository accessRecordRepository,
            @Qualifier("analysisReceiverOptions") ReceiverOptions<String, AccessRequestMessage> analysisReceiverOptions
    ) {
        this.accessRecordRepository = accessRecordRepository;
        this.receiverOptions = receiverOptions;
        this.analysisReceiverOptions = analysisReceiverOptions;
    }

    public Flux<TrafficSummary> countTrafficInIntervals(Duration interval) {
        return KafkaReceiver.create(analysisReceiverOptions.subscription(SUBSCRIPTIONS))
                .receiveAutoAck()
                .flatMap(Flux::collectList)
                .flatMapIterable(messages -> messages)
                .map(ConsumerRecord::value)
                .map(this::getMessageType)
                .window(interval)
                .flatMap(window -> window.groupBy(type -> type)
                        .flatMap(group -> group.count()
                                .map(count -> Map.entry(group.key(), count)))
                        .collectMap(Map.Entry::getKey, Map.Entry::getValue))
                .map(counts -> TrafficSummary.builder()
                        .normal(counts.getOrDefault(TrafficSummary.Level.NORMAL, 0L))
                        .warning(counts.getOrDefault(TrafficSummary.Level.WARNING, 0L))
                        .danger(counts.getOrDefault(TrafficSummary.Level.DANGER, 0L))
                        .build())
                .onErrorResume(error -> {
                    log.error("Error in Kafka message counter stream: {}", error.getMessage(), error);
                    return Mono.empty();
                });
    }

    public Flux<AccessRecord> consume() {
        return KafkaReceiver.create(receiverOptions.subscription(SUBSCRIPTIONS))
                .receiveAutoAck()
                .flatMap(Flux::collectList)
                .flatMap(this::saveBatch);
    }

    private Flux<AccessRecord> saveBatch(
            List<ConsumerRecord<String, AccessRequestMessage>> records
    ) {
        return accessRecordRepository.saveAll(
                records.stream()
                        .map(ConsumerRecord::value)
                        .map(RequestMessageMapper::map)
                        .toList()
        );
    }

    private TrafficSummary.Level getMessageType(AccessRequestMessage message) {
        if (Boolean.TRUE.equals(message.getDanger())) {
            return TrafficSummary.Level.DANGER;
        } else if (Boolean.TRUE.equals(message.getWarning())) {
            return TrafficSummary.Level.WARNING;
        } else {
            return TrafficSummary.Level.NORMAL;
        }
    }
}
