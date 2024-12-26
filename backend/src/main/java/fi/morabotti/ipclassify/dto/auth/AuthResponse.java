package fi.morabotti.ipclassify.dto.auth;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String token;
    private AuthUser user;
}
