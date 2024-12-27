package fi.morabotti.ipclassify.service.consumer;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;

@Component
@RequiredArgsConstructor
public class ConsumerInitializer implements ApplicationListener<ApplicationReadyEvent> {
    private final RequestMessageConsumer requestMessageConsumer;
    private final AccessRequestMessageConsumer accessRequestMessageConsumer;

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        Flux.merge(
                requestMessageConsumer.consume(),
                accessRequestMessageConsumer.consume()
        )
                .subscribe();
    }
}
