package fi.morabotti.ipclassify.config;

import fi.morabotti.ipclassify.security.JwtAuthenticationFilter;
import fi.morabotti.ipclassify.security.JwtTokenProvider;
import fi.morabotti.ipclassify.websocket.MyWebSocketHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.web.reactive.HandlerMapping;
import org.springframework.web.reactive.handler.SimpleUrlHandlerMapping;
import org.springframework.web.reactive.socket.server.WebSocketService;
import org.springframework.web.reactive.socket.server.support.HandshakeWebSocketService;
import org.springframework.web.reactive.socket.server.support.WebSocketHandlerAdapter;
import org.springframework.web.server.WebHandler;
import java.util.Map;
import java.util.Optional;

@Configuration
@RequiredArgsConstructor
public class WebSocketRouteConfig {

    private final JwtTokenProvider jwtTokenProvider;

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public HandlerMapping webSocketHandlerMapping(MyWebSocketHandler myWebSocketHandler) {
        Map<String, Object> urlMap = Map.of("/ws/v1/echo", authWebSocketHandler(myWebSocketHandler));
        SimpleUrlHandlerMapping mapping = new SimpleUrlHandlerMapping();
        mapping.setUrlMap(urlMap);
        mapping.setOrder(-1);
        return mapping;
    }

    @Bean
    public WebSocketHandlerAdapter webSocketHandlerAdapter() {
        WebSocketService webSocketService = new HandshakeWebSocketService();
        return new WebSocketHandlerAdapter(webSocketService);
    }

    private WebHandler authWebSocketHandler(MyWebSocketHandler webSocketHandler) {
        return (exchange) -> {
            Optional<String> token = jwtAuthenticationFilter.extractToken(exchange.getRequest().getHeaders());

            if (token.isEmpty() || !jwtTokenProvider.validateToken(token.get())) {
                exchange.getResponse().setRawStatusCode(401);
                return exchange.getResponse().setComplete();
            }

            Authentication authentication = jwtTokenProvider.getAuthentication(token.get());
            exchange.getAttributes().put("user", authentication.getPrincipal());
            WebSocketService webSocketService = new HandshakeWebSocketService();
            return webSocketService.handleRequest(exchange, webSocketHandler);
        };
    }
}
