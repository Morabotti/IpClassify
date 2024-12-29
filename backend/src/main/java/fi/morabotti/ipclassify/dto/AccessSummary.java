package fi.morabotti.ipclassify.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class AccessSummary {
    private String label;
    private TrafficLevel level;
    private Long count;
}
