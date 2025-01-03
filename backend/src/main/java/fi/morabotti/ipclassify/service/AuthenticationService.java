package fi.morabotti.ipclassify.service;

import fi.morabotti.ipclassify.config.options.AuthOptions;
import fi.morabotti.ipclassify.config.options.SecurityOptions;
import fi.morabotti.ipclassify.dto.auth.AuthResponse;
import fi.morabotti.ipclassify.dto.auth.AuthUser;
import fi.morabotti.ipclassify.dto.auth.LoginRequest;
import fi.morabotti.ipclassify.security.ApplicationUser;
import fi.morabotti.ipclassify.security.JwtAuthenticationFilter;
import fi.morabotti.ipclassify.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final AuthOptions authOptions;
    private final SecurityOptions options;
    private final JwtTokenProvider jwtTokenProvider;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final AccessLogService accessLogService;

    public Mono<AuthResponse> authenticate(LoginRequest request) {
        return Mono.just(request)
                .filter(i -> authOptions.getUsername().equals(i.getUsername())
                    && authOptions.getPassword().equals(i.getPassword()))
                .switchIfEmpty(Mono.error(new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Username or password is incorrect")))
                .map(this::generateResponse);
    }

    public Mono<ApplicationUser> getMe(ServerHttpRequest request) {
        return Mono.justOrEmpty(jwtAuthenticationFilter.extractToken(request.getHeaders()))
                .map(jwtTokenProvider::getAuthentication)
                .map(Authentication::getPrincipal)
                .filter(ApplicationUser.class::isInstance)
                .map(ApplicationUser.class::cast);
    }

    public Mono<AuthResponse> extendSession(ServerWebExchange exchange) {
        return this.getMe(exchange.getRequest())
                .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not logged in")))
                .flatMap(user -> accessLogService.log(exchange.getRequest(), user.getId())
                        .thenReturn(user))
                .map(user -> AuthResponse.builder()
                        .user(AuthUser.from(user))
                        .maxAge(options.getAccessExpiration())
                        .token(jwtTokenProvider.generateToken(user))
                        .build());
    }

    private AuthResponse generateResponse(LoginRequest request) {
        ApplicationUser user = ApplicationUser.builder()
                .id(0L)
                .username(request.getUsername())
                .build();

        return AuthResponse.builder()
                .token(jwtTokenProvider.generateToken(user))
                .maxAge(options.getAccessExpiration())
                .user(AuthUser.from(user))
                .build();
    }
}
