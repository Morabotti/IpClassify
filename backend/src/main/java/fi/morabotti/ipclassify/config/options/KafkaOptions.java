package fi.morabotti.ipclassify.config.options;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Data
public class KafkaOptions {
    public static final String EXAMPLE_TOPIC = "example-topic";
    public static final String REQUEST_MESSAGE_TOPIC = "request-message-topic";
    public static final String ACCESS_REQUEST_MESSAGE_TOPIC = "access-request-message-topic";

    public static final String PRIMARY_GROUP = "primary";
    public static final String ANALYSIS_GROUP = "analysis";

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootStrapServers;

    @Value("${spring.kafka.topic.partitions}")
    private Integer partitions;

    @Value("${spring.kafka.topic.replicas}")
    private Short replicas;
}
