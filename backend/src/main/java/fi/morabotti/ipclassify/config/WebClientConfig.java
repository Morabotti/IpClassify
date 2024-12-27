package fi.morabotti.ipclassify.config;

import fi.morabotti.ipclassify.config.options.ApiClientOptions;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
@RequiredArgsConstructor
public class WebClientConfig {

    private final ApiClientOptions options;

    @Bean
    @Qualifier("ipServiceClient")
    public WebClient ipServiceClient(WebClient.Builder builder) {
        return builder.baseUrl(options.getIpUrl()).build();
    }
}
