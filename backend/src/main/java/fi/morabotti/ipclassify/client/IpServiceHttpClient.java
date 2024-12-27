package fi.morabotti.ipclassify.client;

import fi.morabotti.ipclassify.client.dto.IpGeolocation;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

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
                .bodyToMono(IpGeolocation.class);
    }
}
