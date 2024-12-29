package fi.morabotti.ipclassify.service.consumer;

import fi.morabotti.ipclassify.config.options.KafkaOptions;
import fi.morabotti.ipclassify.domain.AccessRecord;
import fi.morabotti.ipclassify.domain.AccessRequestMessage;
import fi.morabotti.ipclassify.dto.TrafficLevel;
import fi.morabotti.ipclassify.dto.TrafficSummary;
import fi.morabotti.ipclassify.mapper.RequestMessageMapper;
import fi.morabotti.ipclassify.repository.AccessRecordRepository;
import fi.morabotti.ipclassify.service.AccessRecordService;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.kafka.receiver.KafkaReceiver;
import reactor.kafka.receiver.ReceiverOptions;

import java.time.Duration;
import java.time.Instant;
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
    private final Flux<TrafficSummary> sharedTrafficSummaryStream;

    public AccessRequestMessageConsumer(
            ReceiverOptions<String, AccessRequestMessage> receiverOptions,
            AccessRecordRepository accessRecordRepository,
            @Qualifier("analysisReceiverOptions") ReceiverOptions<String, AccessRequestMessage> analysisReceiverOptions
    ) {
        this.accessRecordRepository = accessRecordRepository;
        this.receiverOptions = receiverOptions;
        this.analysisReceiverOptions = analysisReceiverOptions;
        this.sharedTrafficSummaryStream = createTrafficInIntervals(
                Duration.ofSeconds(AccessRecordService.FETCH_INTERVAL))
                .share();
    }

    public Flux<AccessRecord> consume() {
        return KafkaReceiver.create(receiverOptions.subscription(SUBSCRIPTIONS))
                .receiveAutoAck()
                .flatMap(Flux::collectList)
                .flatMap(this::saveBatch)
                .onErrorResume(error -> {
                    log.error("Error in AccessRequestMessageConsumer: {}", error.getMessage(), error);
                    return Mono.empty();
                });
    }

    public Flux<TrafficSummary> getSummaryTrafficStream() {
        return sharedTrafficSummaryStream;
    }

    private Flux<TrafficSummary> createTrafficInIntervals(Duration interval) {
        return KafkaReceiver.create(analysisReceiverOptions.subscription(SUBSCRIPTIONS))
                .receiveAutoAck()
                .flatMap(Flux::collectList)
                .flatMapIterable(messages -> messages)
                .map(ConsumerRecord::value)
                .map(TrafficLevel::from)
                .window(interval)
                .flatMap(window -> window.groupBy(type -> type)
                        .flatMap(group -> group.count()
                                .map(count -> Map.entry(group.key(), count)))
                        .collectMap(Map.Entry::getKey, Map.Entry::getValue))
                .map(counts -> TrafficSummary.builder()
                        .time(Instant.now())
                        .normal(counts.getOrDefault(TrafficLevel.NORMAL, 0L))
                        .warning(counts.getOrDefault(TrafficLevel.WARNING, 0L))
                        .danger(counts.getOrDefault(TrafficLevel.DANGER, 0L))
                        .build())
                .onErrorResume(error -> {
                    log.error("Error in Kafka message counter stream: {}", error.getMessage(), error);
                    return Mono.empty();
                });
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
}
