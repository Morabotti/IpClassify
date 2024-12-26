package fi.morabotti.ipclassify.config;

import fi.morabotti.ipclassify.AppDefault;
import fi.morabotti.ipclassify.config.options.ElasticsearchOptions;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.elc.ReactiveElasticsearchConfiguration;
import org.springframework.data.elasticsearch.repository.config.EnableReactiveElasticsearchRepositories;

@Configuration
@RequiredArgsConstructor
@EnableReactiveElasticsearchRepositories(basePackages = AppDefault.REPOSITORY_PACKAGE)
public class ElasticsearchConfig extends ReactiveElasticsearchConfiguration {
    private final ElasticsearchOptions options;

    @Override
    public ClientConfiguration clientConfiguration() {
        return ClientConfiguration.builder()
                .connectedTo(options.getDefaultHostAndPort())
                .build();
    }
}
