package fi.morabotti.ipclassify.domain;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.time.Instant;

@Data
@Builder
@Document(indexName = "access-record")
public class AccessRecord {
    @Id
    private String id;

    @Field(type = FieldType.Text)
    private String application;

    @Field(type = FieldType.Text)
    private String method;

    @Field(type = FieldType.Ip)
    private String ip;

    @Field(type = FieldType.Match_Only_Text)
    private String requestId;

    @Field(type = FieldType.Match_Only_Text)
    private String userId;

    @Field(type = FieldType.Text)
    private String userAgent;

    @Field(type = FieldType.Text)
    private String referrer;

    @Field(type = FieldType.Text)
    private String acceptLanguage;

    @Field(type = FieldType.Text)
    private String continent;

    @Field(type = FieldType.Text)
    private String country;

    @Field(type = FieldType.Text)
    private String region;

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

    @Field(type = FieldType.Boolean)
    private Boolean danger;

    @Field(type = FieldType.Boolean)
    private Boolean warning;

    @Field(type = FieldType.Date)
    private Instant createdAt;

    @Field(type = FieldType.Date)
    private Instant processedAt;

    @Field(type = FieldType.Date)
    private Instant uploadedAt;
}
