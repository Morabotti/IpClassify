package fi.morabotti.ipclassify.dto.query;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import reactor.util.annotation.Nullable;

import java.util.Optional;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AggregationQuery {
    @NotEmpty(message = "Aggregation field cannot be empty")
    private String field;

    @Positive(message = "Count cant be negative")
    @Nullable
    private Integer count;

    public Optional<String> getOptionalField() {
        return Optional.ofNullable(field);
    }

    public Optional<Integer> getOptionalCount() {
        return Optional.ofNullable(count);
    }
}
