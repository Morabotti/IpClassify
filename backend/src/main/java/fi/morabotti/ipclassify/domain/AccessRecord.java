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
    private String userId;

    @Field(type = FieldType.Text)
    private String userAgent;

    @Field(type = FieldType.Text)
    private String referrer;

    @Field(type = FieldType.Text)
    private String acceptLanguage;

    @Field(type = FieldType.Boolean)
    private Boolean danger;

    @Field(type = FieldType.Boolean)
    private Boolean warning;

    @Field(type = FieldType.Date)
    private Instant createdAt;

    @Field(type = FieldType.Date)
    private Instant uploadedAt;
}
