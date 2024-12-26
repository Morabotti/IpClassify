package fi.morabotti.ipclassify.config.options;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.util.List;

@Component
@Data
public class ElasticsearchOptions {
    @Value("${spring.elasticsearch.uris}")
    private List<String> uris;

    public String getDefaultHostAndPort() {
        URI uri = URI.create(uris.getFirst());
        return String.format("%s:%s", uri.getHost(), uri.getPort());
    }
}
