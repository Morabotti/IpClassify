package fi.morabotti.ipclassify.config.options;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Data
public class KafkaOptions {
    public static final String EXAMPLE_TOPIC = "example-topic";

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootStrapServers;

    @Value("${spring.kafka.topic.partitions}")
    private Integer partitions;

    @Value("${spring.kafka.topic.replicas}")
    private Short replicas;
}
