package fi.morabotti.ipclassify.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.time.Instant;

@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Document(indexName = "location-record")
public class LocationRecord {
    @Id
    @Field(type = FieldType.Ip)
    private String ip;

    @Field(type = FieldType.Text)
    private String continent;

    @Field(type = FieldType.Match_Only_Text)
    private String continentCode;

    @Field(type = FieldType.Text)
    private String country;

    @Field(type = FieldType.Match_Only_Text)
    private String region;

    @Field(type = FieldType.Text)
    private String regionName;

    @Field(type = FieldType.Text)
    private String city;

    @Field(type = FieldType.Match_Only_Text)
    private String zip;

    @Field(type = FieldType.Double)
    private Double latitude;

    @Field(type = FieldType.Double)
    private Double longitude;

    @Field(type = FieldType.Match_Only_Text)
    private String timezone;

    @Field(type = FieldType.Match_Only_Text)
    private String currency;

    @Field(type = FieldType.Text)
    private String isp;

    @Field(type = FieldType.Text)
    private String org;

    @Field(type = FieldType.Boolean)
    private Boolean isMobile;

    @Field(type = FieldType.Boolean)
    private Boolean isProxy;

    @Field(type = FieldType.Boolean)
    private Boolean isHosting;

    @Field(type = FieldType.Date)
    private Instant createdAt;

    @Field(type = FieldType.Date)
    private Instant updatedAt;
}
