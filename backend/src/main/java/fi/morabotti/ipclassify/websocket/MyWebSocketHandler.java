package fi.morabotti.ipclassify.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import fi.morabotti.ipclassify.dto.TrafficSummary;
import fi.morabotti.ipclassify.dto.common.WSMessage;
import fi.morabotti.ipclassify.security.ApplicationUser;
import fi.morabotti.ipclassify.service.AccessRecordService;
import fi.morabotti.ipclassify.service.consumer.AccessRequestMessageConsumer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
@RequiredArgsConstructor
public class MyWebSocketHandler implements WebSocketHandler {
    private final Set<WebSocketSession> sessions = Collections.newSetFromMap(new ConcurrentHashMap<>());
    private final AccessRequestMessageConsumer accessRequestMessageConsumer;
    private final AccessRecordService accessRecordService;
    private final ObjectMapper objectMapper;

    private ApplicationUser user;

    @Override
    public Mono<Void> handle(WebSocketSession session) {
        sessions.add(session);
        log.info("New session: {} with username {}", session.getId(), user.getUsername());

        Mono<WebSocketMessage> greetMessage = accessRecordService
                .getBackTrackedSummary(AccessRecordService.HISTORY_SIZE)
                .collectList()
                .flatMap(i -> createResponseMessage(session, WSMessage.<List<TrafficSummary>>builder()
                        .data(i)
                        .type(WSMessage.MessageType.INTERVAL_HISTORY)
                        .build()))
                .onErrorResume(error -> {
                    log.error("Error sending history: {}", error.getMessage(), error);
                    return Mono.empty();
                });

        Flux<WebSocketMessage> userMessageHandler = session.receive()
                .map(WebSocketMessage::getPayloadAsText)
                .flatMap(message -> processUserMessage(message, session))
                .onErrorResume(error -> {
                    log.error("Error processing message: {}", error.getMessage(), error);
                    return Mono.empty();
                });

        Flux<WebSocketMessage> kafkaMessageCounter = accessRequestMessageConsumer.getSummaryTrafficStream()
                .map(summary -> WSMessage.<TrafficSummary>builder()
                        .data(summary)
                        .type(WSMessage.MessageType.INTERVAL_RESPONSE)
                        .build())
                .flatMap(message -> createResponseMessage(session, message))
                .onErrorResume(error -> {
                    log.error("Error sending counter: {}", error.getMessage(), error);
                    return Mono.empty();
                });

        return session.send(
                Flux.concat(
                        greetMessage,
                        Flux.merge(
                                userMessageHandler,
                                kafkaMessageCounter
                        )
                )
        )
                .doFinally(signalType -> {
                    sessions.remove(session);
                    log.info("Removed session: {} with signalType {}", session.getId(), signalType);
                });
    }

    public void setCurrentUser(ApplicationUser user) {
        this.user = user;
    }

    private Mono<WebSocketMessage> processUserMessage(String message, WebSocketSession session) {
        log.info("Received message from {}: {}", session.getId(), message);

        return createResponseMessage(session, WSMessage.<String>builder()
                .type(WSMessage.MessageType.ECHO)
                .data(message)
                .build());
    }

    private <T> Mono<WebSocketMessage> createResponseMessage(WebSocketSession session, WSMessage<T> message) {
        try {
            String jsonMessage = objectMapper.writeValueAsString(message);
            return Mono.just(session.textMessage(jsonMessage));
        }
        catch (Exception e) {
            return Mono.error(e);
        }
    }
}
