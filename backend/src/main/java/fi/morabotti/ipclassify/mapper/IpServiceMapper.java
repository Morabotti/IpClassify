package fi.morabotti.ipclassify.mapper;

import fi.morabotti.ipclassify.client.dto.IpGeolocation;
import fi.morabotti.ipclassify.domain.LocationRecord;
import org.springframework.stereotype.Component;

@Component
public class IpServiceMapper {
    public static LocationRecord map(String ip, IpGeolocation location) {
        return LocationRecord.builder()
                .ip(ip)
                .continentCode(location.getContinentCode())
                .city(location.getCity())
                .isp(location.getIsp())
                .country(location.getCountry())
                .zip(location.getZip())
                .isProxy(location.isProxy())
                .continent(location.getContinent())
                .region(location.getRegion())
                .latitude(location.getLat())
                .longitude(location.getLon())
                .regionName(location.getRegionName())
                .currency(location.getCurrency())
                .timezone(location.getTimezone())
                .isHosting(location.isHosting())
                .org(location.getOrg())
                .isMobile(location.isMobile())
                .build();
    }
}
