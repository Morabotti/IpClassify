package fi.morabotti.ipclassify.service;

import fi.morabotti.ipclassify.domain.RequestMessage;
import fi.morabotti.ipclassify.dto.MockTrafficRequest;
import fi.morabotti.ipclassify.service.producer.RequestMessageProducer;
import fi.morabotti.ipclassify.util.IpUtility;
import lombok.RequiredArgsConstructor;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccessLogService {
    private static final String APPLICATION_NAME = "IpClassify";

    private final AuthenticationService authenticationService;
    private final RequestMessageProducer producer;
    private final IpUtility ipUtility;

    public Mono<RequestMessage> log(ServerHttpRequest request) {
        return authenticationService.getMe(request)
                .map(user -> create(request, user.getId()))
                .flatMap(message -> producer.send(message)
                        .thenReturn(message));
    }

    public Flux<RequestMessage> log(MockTrafficRequest request) {
        throw new UnsupportedOperationException("Not yet implemented");
    }

    private RequestMessage create(ServerHttpRequest request, Long userId) {
        return RequestMessage.builder()
                .uuid(UUID.randomUUID())
                .ip(Optional.ofNullable(request.getRemoteAddress())
                        .map(InetSocketAddress::getAddress)
                        .map(InetAddress::getHostAddress)
                        .flatMap(this::cleanIpAddress)
                        .map(ipUtility::convertPrivateIpToPublic)
                        .orElse("unknown"))
                .application(APPLICATION_NAME)
                .language(Optional.ofNullable(request
                                .getHeaders()
                                .getFirst("Accept-Language"))
                        .orElse("unknown"))
                .path(request.getURI().getPath())
                .method(request.getMethod().name())
                .referrer(Optional.ofNullable(request
                                .getHeaders()
                                .getFirst("referer"))
                        .orElse("unknown"))
                .requestId(Optional.of(request.getId()).orElse("unknown"))
                .userAgent(Optional.ofNullable(request
                                .getHeaders()
                                .getFirst("User-Agent"))
                        .orElse("unknown"))
                .userId(userId)
                .referrer(Optional.ofNullable(request
                                .getHeaders()
                                .getFirst("Referer"))
                        .orElse("unknown"))
                .createdAt(Instant.now())
                .build();
    }

    private Optional<String> cleanIpAddress(String ipAddress) {
        if ("0:0:0:0:0:0:0:1".equals(ipAddress) || "::1".equals(ipAddress)) {
            return Optional.of("127.0.0.1");
        }

        if (ipAddress != null && ipAddress.contains(":") && ipAddress.contains(".")) {
            return Optional.of(ipAddress.substring(ipAddress.lastIndexOf(":") + 1));
        }

        return Optional.empty();
    }
}
