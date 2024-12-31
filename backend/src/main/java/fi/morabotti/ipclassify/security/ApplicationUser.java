package fi.morabotti.ipclassify.security;

import io.jsonwebtoken.Claims;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationUser {
    private Long id = 0L;
    private String username;

    public static ApplicationUser from(Claims claims) {
        return ApplicationUser.builder()
                .id(claims.get("id", Long.class))
                .username(claims.get("username", String.class))
                .build();
    }
}
