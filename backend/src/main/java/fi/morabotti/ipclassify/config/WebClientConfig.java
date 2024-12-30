package fi.morabotti.ipclassify.config;

import fi.morabotti.ipclassify.config.options.ApiClientOptions;
import io.netty.handler.ssl.SslContextBuilder;
import io.netty.handler.ssl.util.InsecureTrustManagerFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import javax.net.ssl.SSLException;

@Configuration
@RequiredArgsConstructor
public class WebClientConfig {

    private final ApiClientOptions options;

    @Bean
    @Qualifier("ipServiceClient")
    public WebClient ipServiceClient(WebClient.Builder builder) {
        HttpClient httpClient = HttpClient.create()
                .secure(spec -> {
                    try {
                        spec.sslContext(SslContextBuilder.forClient()
                                .trustManager(InsecureTrustManagerFactory.INSTANCE)
                                .build());
                    } catch (SSLException e) {
                        throw new RuntimeException(e);
                    }
                });

        return builder.baseUrl(options.getIpUrl())
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }
}
