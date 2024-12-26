package fi.morabotti.ipclassify.service;

import fi.morabotti.ipclassify.config.options.KafkaOptions;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class KafkaConsumerInitializer implements ApplicationListener<ApplicationReadyEvent> {
    private final KafkaConsumer kafkaConsumer;

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        kafkaConsumer.consumeMessages(KafkaOptions.EXAMPLE_TOPIC).subscribe();
    }
}
