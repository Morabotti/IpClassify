package fi.morabotti.ipclassify.dto.auth;

import fi.morabotti.ipclassify.security.ApplicationUser;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthUser {
    private Long id;
    private String username;

    public static AuthUser from(ApplicationUser applicationUser) {
        return AuthUser.builder()
                .id(applicationUser.getId())
                .username(applicationUser.getUsername())
                .build();
    }
}
