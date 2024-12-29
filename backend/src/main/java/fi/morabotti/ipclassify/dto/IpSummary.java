package fi.morabotti.ipclassify.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class IpSummary {
    private String ip;
    private TrafficSummary.Level level;
    private Long count;
}
