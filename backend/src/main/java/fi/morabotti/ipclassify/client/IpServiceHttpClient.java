package fi.morabotti.ipclassify.client;

import fi.morabotti.ipclassify.client.dto.IpGeolocation;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.time.Duration;

@Service
public class IpServiceHttpClient {
    private final WebClient ipServiceClient;

    public IpServiceHttpClient(@Qualifier("ipServiceClient") WebClient ipServiceClient) {
        this.ipServiceClient = ipServiceClient;
    }

    public Mono<IpGeolocation> fetchIpGeolocation(String ip) {
        return ipServiceClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/json/{ip}")
                        .queryParam("fields", "66322431")
                        .build(ip))
                .retrieve()
                .onStatus(status -> status.value() == 419,
                        response -> Mono.error(new RuntimeException("API throttling limit reached (HTTP 419).")))
                .bodyToMono(IpGeolocation.class)
                .retryWhen(Retry.backoff(3, Duration.ofSeconds(35))
                        .filter(throwable -> throwable.getMessage().contains("(HTTP 419)"))
                        .onRetryExhaustedThrow((retryBackoffSpec, retrySignal) ->
                                new RuntimeException("Retries exhausted for API throttling (HTTP 419)."))
                );

    }
}
