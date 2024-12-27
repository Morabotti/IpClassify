package fi.morabotti.ipclassify.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.Instant;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
public class AccessRequestMessage extends RequestMessage {
    private String continent;
    private String country;
    private String region;
    private String city;
    private String zip;
    private Double latitude;
    private Double longitude;
    private String timezone;
    private String isp;
    private String org;

    private Boolean isMobile;
    private Boolean isProxy;
    private Boolean isHosting;

    private Boolean danger;
    private Boolean warning;

    private Instant createdAt;
    private Instant processedAt;
}
