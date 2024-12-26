package fi.morabotti.ipclassify.controller;

import fi.morabotti.ipclassify.dto.auth.AuthResponse;
import fi.morabotti.ipclassify.dto.auth.LoginRequest;
import fi.morabotti.ipclassify.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/v1/auth")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/login")
    public Mono<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return authenticationService.authenticate(request);
    }

    @GetMapping("/me")
    public Mono<AuthResponse> getMe(ServerWebExchange exchange) {
        return authenticationService.extendSession(exchange);
    }
}
