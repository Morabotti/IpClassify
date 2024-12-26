package fi.morabotti.ipclassify.security;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.web.server.context.ServerSecurityContextRepository;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter implements ServerSecurityContextRepository {
    private final JwtTokenProvider jwtTokenProvider;
    private static final String BEARER_PREFIX = "Bearer ";

    @Override
    public Mono<SecurityContext> load(ServerWebExchange exchange) {
        return Mono.justOrEmpty(extractToken(exchange.getRequest().getHeaders()))
                .filter(jwtTokenProvider::validateToken)
                .map(jwtTokenProvider::getAuthentication)
                .map(SecurityContextImpl::new);
    }

    public Optional<String> extractToken(HttpHeaders headers) {
        return Optional.ofNullable(headers.getFirst(HttpHeaders.AUTHORIZATION))
                .filter(authHeader -> authHeader.startsWith(BEARER_PREFIX))
                .map(authHeader -> authHeader.substring(BEARER_PREFIX.length()));
    }

    @Override
    public Mono<Void> save(ServerWebExchange exchange, SecurityContext context) {
        throw new UnsupportedOperationException();
    }
}
