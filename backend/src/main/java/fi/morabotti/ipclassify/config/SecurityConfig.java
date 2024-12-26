package fi.morabotti.ipclassify.config;

import fi.morabotti.ipclassify.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

@Configuration
@RequiredArgsConstructor
@EnableReactiveMethodSecurity
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityWebFilterChain securityWebFilterChain() {
        return ServerHttpSecurity.http()
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .securityContextRepository(jwtAuthenticationFilter)
                .authorizeExchange(exchanges -> exchanges
                        .pathMatchers("/ws/**").permitAll()
                        .pathMatchers("/api/v1/auth/login").permitAll()
                        .anyExchange()
                        .authenticated()
                )
                .exceptionHandling(exceptionHandling -> exceptionHandling
                        .authenticationEntryPoint((exchange, ex) ->
                                Mono.error(new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized"))
                        )
                        .accessDeniedHandler((exchange, denied) ->
                                Mono.error(new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden"))
                        )
                )
                .build();
    }
}
