package fi.morabotti.ipclassify.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import reactor.util.annotation.Nullable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MockTrafficRequest {
    private Boolean onlyKnown;
    private Long amount;

    @Nullable
    private String from;
}
