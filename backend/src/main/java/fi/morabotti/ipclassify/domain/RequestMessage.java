package fi.morabotti.ipclassify.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.Instant;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class RequestMessage {
    private UUID uuid;
    private String ip;
    private String requestId;
    private String application;
    private String path;
    private String method;

    private Long userId;

    private String userAgent;
    private String language;
    private String referrer;
    private Instant createdAt;
}
