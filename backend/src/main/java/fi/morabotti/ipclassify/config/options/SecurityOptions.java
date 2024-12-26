package fi.morabotti.ipclassify.config.options;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Data
public class SecurityOptions {
    public static final String JWT_AUDIENCE = "ipclassify";
    public static final String JWT_ISSUER = "ipclassify";

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration.access}")
    private Long accessExpiration;
}
