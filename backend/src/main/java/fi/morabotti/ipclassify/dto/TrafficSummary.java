package fi.morabotti.ipclassify.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrafficSummary {
    private Long normal;
    private Long warning;
    private Long danger;
    private String time;

    public enum Level {
        NORMAL,
        WARNING,
        DANGER
    }
}
