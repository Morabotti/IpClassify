package fi.morabotti.ipclassify.config.options;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Data
public class ApiClientOptions {
    @Value("${api.client.ip.url}")
    private String ipUrl;
}