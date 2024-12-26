package fi.morabotti.ipclassify.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IpClassification {
    private String ip;
    private Boolean isDanger;
    private Boolean isWarning;
}
