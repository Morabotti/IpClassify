package fi.morabotti.ipclassify.service.consumer;

import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import reactor.core.Disposable;
import reactor.core.publisher.Flux;

@Component
@RequiredArgsConstructor
public class ConsumerInitializer implements ApplicationListener<ApplicationReadyEvent> {
    private final RequestMessageConsumer requestMessageConsumer;
    private final AccessRequestMessageConsumer accessRequestMessageConsumer;

    private Disposable subscription;

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        subscription = Flux.merge(
                requestMessageConsumer.consume(),
                accessRequestMessageConsumer.consume()
        )
                .subscribe();
    }

    @PreDestroy
    public void onCleanup() {
        if (subscription != null && !subscription.isDisposed()) {
            subscription.dispose();
        }
    }
}
