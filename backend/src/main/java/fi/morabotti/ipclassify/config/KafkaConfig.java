package fi.morabotti.ipclassify.config;

import fi.morabotti.ipclassify.AppDefault;
import fi.morabotti.ipclassify.config.options.KafkaOptions;
import fi.morabotti.ipclassify.domain.AccessRequestMessage;
import fi.morabotti.ipclassify.domain.RequestMessage;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.kafka.support.serializer.JsonSerializer;
import reactor.kafka.receiver.ReceiverOptions;
import reactor.kafka.sender.KafkaSender;
import reactor.kafka.sender.SenderOptions;

import java.util.HashMap;
import java.util.Map;

@Configuration
@RequiredArgsConstructor
public class KafkaConfig {
    private final KafkaOptions options;

    @Bean
    public KafkaSender<String, RequestMessage> requestMessageSender() {
        return createSenderOptions();
    }

    @Bean
    public ReceiverOptions<String, RequestMessage> requestMessagePrimaryReceiverOptions() {
        return createReceiverOptions(KafkaOptions.PRIMARY_GROUP, RequestMessage.class);
    }

    @Bean
    public KafkaSender<String, AccessRequestMessage> accessRequestMessageSender() {
        return createSenderOptions();
    }

    @Primary
    @Bean
    public ReceiverOptions<String, AccessRequestMessage> accessRequestMessagePrimaryReceiverOptions() {
        return createReceiverOptions(KafkaOptions.PRIMARY_GROUP, AccessRequestMessage.class);
    }

    @Bean("accessRequestMessageAnalysisReceiverOptions")
    public ReceiverOptions<String, AccessRequestMessage> accessRequestMessageAnalysisReceiverOptions() {
        return createReceiverOptions(KafkaOptions.ANALYSIS_GROUP, AccessRequestMessage.class);
    }

    private <T> KafkaSender<String, T> createSenderOptions() {
        Map<String, Object> producerProps = new HashMap<>();
        producerProps.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, options.getBootStrapServers());
        producerProps.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        producerProps.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        producerProps.put(ProducerConfig.ACKS_CONFIG, "all");

        SenderOptions<String, T> senderOptions = SenderOptions.create(producerProps);
        return KafkaSender.create(senderOptions);
    }

    private <T> ReceiverOptions<String, T> createReceiverOptions(String groupId, Class<T> clazz) {
        Map<String, Object> consumerProps = new HashMap<>();
        consumerProps.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, options.getBootStrapServers());
        consumerProps.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        consumerProps.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        consumerProps.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);

        JsonDeserializer<T> jsonDeserializer = new JsonDeserializer<>(clazz);
        jsonDeserializer.addTrustedPackages(AppDefault.DOMAIN_PACKAGE);

        consumerProps.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);

        return ReceiverOptions.<String, T>create(consumerProps)
                .withValueDeserializer(jsonDeserializer);
    }
}
