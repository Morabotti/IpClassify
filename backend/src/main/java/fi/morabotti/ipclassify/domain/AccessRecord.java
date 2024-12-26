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

    @Field(type = FieldType.Ip)
    private String ip;

    @Field(type = FieldType.Date)
    private Instant createdAt;
}
