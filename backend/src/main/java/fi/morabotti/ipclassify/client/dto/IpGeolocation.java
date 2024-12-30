package fi.morabotti.ipclassify.client.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IpGeolocation {
    private String query;
    private String status;
    private String continent;
    private String continentCode;
    private String country;
    private String countryCode;
    private String region;
    private String regionName;
    private String city;
    private String zip;
    private double lat;
    private double lon;
    private String timezone;
    private int offset;
    private String currency;
    private String isp;
    private String org;
    private String as;
    private String asname;
    private String reverse;
    private boolean mobile;
    private boolean proxy;
    private boolean hosting;
}
