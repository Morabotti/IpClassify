package fi.morabotti.ipclassify.config;

import fi.morabotti.ipclassify.AppDefault;
import fi.morabotti.ipclassify.config.options.KafkaOptions;
import fi.morabotti.ipclassify.domain.MyMessage;
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
    public KafkaSender<String, MyMessage> myMessageSender() {
        Map<String, Object> producerProps = new HashMap<>();
        producerProps.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, options.getBootStrapServers());
        producerProps.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        producerProps.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        producerProps.put(ProducerConfig.ACKS_CONFIG, "all");

        SenderOptions<String, MyMessage> senderOptions = SenderOptions.create(producerProps);
        return KafkaSender.create(senderOptions);
    }

    @Primary
    @Bean
    public ReceiverOptions<String, MyMessage> myMessagePrimaryReceiverOptions() {
        return createReceiverOptions("primary-group", MyMessage.class);
    }

    @Bean("myMessageSecondaryReceiverOptions")
    public ReceiverOptions<String, MyMessage> myMessageSecondaryReceiverOptions() {
        return createReceiverOptions("secondary-group", MyMessage.class);
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
