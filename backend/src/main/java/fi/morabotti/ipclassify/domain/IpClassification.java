package fi.morabotti.ipclassify.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(indexName = "ip-classification")
public class IpClassification {

    @Id
    @Field(type = FieldType.Ip)
    private String ip;

    @Field(type = FieldType.Boolean)
    private Boolean isDanger;

    @Field(type = FieldType.Boolean)
    private Boolean isWarning;

    public static IpClassification empty(String ip) {
        return IpClassification.builder()
                .ip(ip)
                .isDanger(false)
                .isWarning(false)
                .build();
    }
}
