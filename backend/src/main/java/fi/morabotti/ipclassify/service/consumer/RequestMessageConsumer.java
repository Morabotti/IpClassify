package fi.morabotti.ipclassify.service.consumer;

import fi.morabotti.ipclassify.config.options.KafkaOptions;
import fi.morabotti.ipclassify.domain.AccessRequestMessage;
import fi.morabotti.ipclassify.domain.IpClassification;
import fi.morabotti.ipclassify.domain.LocationRecord;
import fi.morabotti.ipclassify.domain.RequestMessage;
import fi.morabotti.ipclassify.mapper.RequestMessageMapper;
import fi.morabotti.ipclassify.service.IpClassificationService;
import fi.morabotti.ipclassify.service.IpLocationService;
import fi.morabotti.ipclassify.service.producer.AccessRequestMessageProducer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.kafka.receiver.KafkaReceiver;
import reactor.kafka.receiver.ReceiverOptions;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class RequestMessageConsumer {
    private final ReceiverOptions<String, RequestMessage> receiverOptions;
    private final IpLocationService ipLocationService;
    private final IpClassificationService ipClassificationService;
    private final AccessRequestMessageProducer accessRequestMessageProducer;

    private final static Set<String> SUBSCRIPTIONS = Set.of(KafkaOptions.REQUEST_MESSAGE_TOPIC);

    public Flux<List<AccessRequestMessage>> consume() {
        return KafkaReceiver.create(receiverOptions.subscription(SUBSCRIPTIONS))
                .receiveAutoAck()
                .flatMap(Flux::collectList)
                .flatMap(this::processBatch, 4)
                .flatMap(batch -> accessRequestMessageProducer
                        .sendAll(Flux.fromIterable(batch))
                        .then(Mono.just(batch)))
                .onErrorResume(error -> {
                    log.error("Error in RequestMessageConsumer: {}", error.getMessage(), error);
                    return Mono.empty();
                });
    }

    private Mono<List<AccessRequestMessage>> processBatch(
            List<ConsumerRecord<String, RequestMessage>> records
    ) {
        Set<String> uniqueIps = records.stream()
                .map(record -> record.value().getIp())
                .collect(Collectors.toSet());

        Mono<Map<String, LocationRecord>> locationRecords = ipLocationService.getLocationRecords(uniqueIps)
                .collectMap(LocationRecord::getIp);

        Mono<Map<String, IpClassification>> ipClassifications = ipClassificationService.getIpClassifications(uniqueIps)
                .collectMap(IpClassification::getIp);

        return Mono.zip(locationRecords, ipClassifications)
                .flatMap(tuple -> mapMessages(records, tuple.getT1(), tuple.getT2()));
    }

    private Mono<List<AccessRequestMessage>> mapMessages(
            List<ConsumerRecord<String, RequestMessage>> records,
            Map<String, LocationRecord> locationRecords,
            Map<String, IpClassification> ipClassifications
    ) {
        return Flux.fromIterable(records)
                .map(ConsumerRecord::value)
                .map(message -> RequestMessageMapper.map(
                        message,
                        ipClassifications.get(message.getIp()),
                        locationRecords.get(message.getIp()),
                        true))
                .collectList();
    }
}
