package fi.morabotti.ipclassify.mapper;

import fi.morabotti.ipclassify.domain.AccessRecord;
import fi.morabotti.ipclassify.domain.AccessRequestMessage;
import fi.morabotti.ipclassify.domain.IpClassification;
import fi.morabotti.ipclassify.domain.LocationRecord;
import fi.morabotti.ipclassify.domain.RequestMessage;
import org.springframework.stereotype.Component;
import reactor.util.annotation.Nullable;

import java.time.Instant;

@Component
public class RequestMessageMapper {
    public static AccessRequestMessage map(RequestMessage message) {
        return AccessRequestMessage.builder()
                .uuid(message.getUuid())
                .ip(message.getIp())
                .requestId(message.getRequestId())
                .application(message.getApplication())
                .path(message.getPath())
                .method(message.getMethod())
                .userId(message.getUserId())
                .userAgent(message.getUserAgent())
                .language(message.getLanguage())
                .referrer(message.getReferrer())
                .createdAt(message.getCreatedAt())
                .build();
    }

    public static AccessRequestMessage map(AccessRequestMessage message, IpClassification ipClassification) {
        return message.toBuilder()
                .danger(ipClassification.getIsDanger())
                .warning(ipClassification.getIsWarning())
                .build();
    }

    public static AccessRequestMessage map(AccessRequestMessage message, LocationRecord location) {
        return message.toBuilder()
                .continent(location.getContinent())
                .country(location.getCountry())
                .region(location.getRegion())
                .city(location.getCity())
                .zip(location.getZip())
                .latitude(location.getLatitude())
                .longitude(location.getLongitude())
                .timezone(location.getTimezone())
                .org(location.getOrg())
                .isp(location.getIsp())
                .isMobile(location.getIsMobile())
                .isHosting(location.getIsHosting())
                .isProxy(location.getIsProxy())
                .build();
    }

    public static AccessRequestMessage map(
            RequestMessage message,
            @Nullable IpClassification ipClassification,
            @Nullable LocationRecord location,
            Boolean processed
    ) {
        var builder = AccessRequestMessage.builder()
                .uuid(message.getUuid())
                .ip(message.getIp())
                .requestId(message.getRequestId())
                .application(message.getApplication())
                .path(message.getPath())
                .method(message.getMethod())
                .userId(message.getUserId())
                .userAgent(message.getUserAgent())
                .language(message.getLanguage())
                .referrer(message.getReferrer())
                .createdAt(message.getCreatedAt());

        if (processed != null && processed) {
            builder = builder.processedAt(Instant.now());
        }

        if (ipClassification != null) {
            builder = builder.danger(ipClassification.getIsDanger())
                    .warning(ipClassification.getIsWarning());
        }

        if (location != null) {
            builder = builder.continent(location.getContinent())
                    .country(location.getCountry())
                    .region(location.getRegion())
                    .city(location.getCity())
                    .zip(location.getZip())
                    .latitude(location.getLatitude())
                    .longitude(location.getLongitude())
                    .timezone(location.getTimezone())
                    .org(location.getOrg())
                    .isp(location.getIsp())
                    .isMobile(location.getIsMobile())
                    .isHosting(location.getIsHosting())
                    .isProxy(location.getIsProxy());
        }

        return builder.build();
    }

    public static AccessRecord map(AccessRequestMessage message) {
        return AccessRecord.builder()
                .ip(message.getIp())
                .createdAt(message.getCreatedAt())
                .processedAt(message.getProcessedAt())
                .requestId(message.getRequestId())
                .isp(message.getIsp())
                .org(message.getOrg())
                .isMobile(message.getIsMobile())
                .isHosting(message.getIsHosting())
                .isProxy(message.getIsProxy())
                .continent(message.getContinent())
                .region(message.getRegion())
                .country(message.getCountry())
                .city(message.getCity())
                .zip(message.getZip())
                .latitude(message.getLatitude())
                .longitude(message.getLongitude())
                .danger(message.getDanger())
                .warning(message.getWarning())
                .acceptLanguage(message.getLanguage())
                .userAgent(message.getUserAgent())
                .referrer(message.getReferrer())
                .application(message.getApplication())
                .method(message.getMethod())
                .path(message.getPath())
                .timezone(message.getTimezone())
                .build();
    }
}
