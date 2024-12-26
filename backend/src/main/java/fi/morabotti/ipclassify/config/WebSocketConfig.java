package fi.morabotti.ipclassify.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.socket.server.support.HandshakeWebSocketService;
import org.springframework.web.reactive.socket.server.support.WebSocketHandlerAdapter;
import org.springframework.web.reactive.socket.server.upgrade.ReactorNettyRequestUpgradeStrategy;

@Configuration
public class WebSocketConfig {
    @Bean
    public WebSocketHandlerAdapter handlerAdapter() {
        ReactorNettyRequestUpgradeStrategy upgradeStrategy = new ReactorNettyRequestUpgradeStrategy();
        return new WebSocketHandlerAdapter(new HandshakeWebSocketService(upgradeStrategy));
    }
}
