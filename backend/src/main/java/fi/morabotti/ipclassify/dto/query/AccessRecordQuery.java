package fi.morabotti.ipclassify.dto.query;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import reactor.util.annotation.Nullable;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccessRecordQuery {
    @Nullable
    private String ip;

    @Nullable
    private String continent;

    @Nullable
    private String country;

    @Nullable
    private String zip;

    @Nullable
    private String city;

    @Nullable
    private String application;

    @Nullable
    private String method;

    @Nullable
    private String path;

    @Nullable
    private Long userId;

    @Nullable
    private String isp;

    @Nullable
    private String timezone;

    @Nullable
    private Boolean isMobile;

    @Nullable
    private Boolean isProxy;

    @Nullable
    private Boolean isHosting;

    public AccessRecordQuery decode() {
        if (continent != null) setContinent(URLDecoder.decode(continent, StandardCharsets.UTF_8));
        if (country != null) setCountry(URLDecoder.decode(country, StandardCharsets.UTF_8));
        if (zip != null) setZip(URLDecoder.decode(zip, StandardCharsets.UTF_8));
        if (city != null) setCity(URLDecoder.decode(city, StandardCharsets.UTF_8));
        if (application != null) setApplication(URLDecoder.decode(application, StandardCharsets.UTF_8));
        if (method != null) setMethod(URLDecoder.decode(method, StandardCharsets.UTF_8));
        if (path != null) setPath(URLDecoder.decode(path, StandardCharsets.UTF_8));
        if (isp != null) setIsp(URLDecoder.decode(isp, StandardCharsets.UTF_8));
        if (timezone != null) setTimezone(URLDecoder.decode(timezone, StandardCharsets.UTF_8));
        if (ip != null) setIp(URLDecoder.decode(ip, StandardCharsets.UTF_8));

        return this;
    }
}
