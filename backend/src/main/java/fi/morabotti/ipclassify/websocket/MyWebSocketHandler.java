package fi.morabotti.ipclassify.websocket;

import fi.morabotti.ipclassify.config.options.KafkaOptions;
import fi.morabotti.ipclassify.security.ApplicationUser;
import fi.morabotti.ipclassify.service.KafkaConsumer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.Collections;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
@RequiredArgsConstructor
public class MyWebSocketHandler implements WebSocketHandler {
    private final Set<WebSocketSession> sessions = Collections.newSetFromMap(new ConcurrentHashMap<>());

    private final KafkaConsumer kafkaConsumer;

    @Override
    public Mono<Void> handle(WebSocketSession session) {
        sessions.add(session);

        Optional<ApplicationUser> user = getUser(session);

        log.info(
                "New session: {} with username {}",
                session.getId(), user.map(ApplicationUser::getUsername).orElse("anonymous")
        );

        Flux<WebSocketMessage> userMessageHandler = session.receive()
                .map(WebSocketMessage::getPayloadAsText)
                .flatMap(message -> processUserMessage(message, session))
                .onErrorResume(error -> {
                    log.error("Error processing message: {}", error.getMessage(), error);
                    return Mono.empty();
                });

        Flux<WebSocketMessage> kafkaMessageCounter = kafkaConsumer.countMessagesInIntervals(KafkaOptions.EXAMPLE_TOPIC, Duration.ofSeconds(10))
                .map(count -> session.textMessage(String.format("Messages in the last 10 seconds: %d", count)))
                .onErrorResume(error -> {
                    log.error("Error in Kafka message counter stream: {}", error.getMessage(), error);
                    return Mono.empty();
                });

        return session.send(
                Flux.merge(
                        userMessageHandler,
                        kafkaMessageCounter
                )
        )
                .doFinally(signalType -> {
                    sessions.remove(session);
                    log.info("Removed session: {} with signalType {}", session.getId(), signalType);
                });
    }

    private Optional<ApplicationUser> getUser(WebSocketSession session) {
        return Optional.ofNullable((ServerWebExchange)session.getAttributes().get(ServerWebExchange.class.getName()))
                .map(exchange -> (ApplicationUser)exchange.getAttributes().get("user"));
    }

    private Mono<WebSocketMessage> processUserMessage(String message, WebSocketSession session) {
        log.info("Received message from {}: {}", session.getId(), message);
        return Mono.just(session.textMessage("Echo: " + message));
    }
}
