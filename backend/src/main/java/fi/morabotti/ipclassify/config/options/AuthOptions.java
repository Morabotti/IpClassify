package fi.morabotti.ipclassify.config.options;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Data
public class AuthOptions {
    @Value("${auth.username}")
    private String username;

    @Value("${auth.password}")
    private String password;
}
