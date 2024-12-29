package fi.morabotti.ipclassify.dto.query;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Optional;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DateQuery {
    private Instant before;
    private Instant after;

    public Optional<Instant> getOptionalBefore() {
        return Optional.ofNullable(before);
    }

    public Optional<Instant> getOptionalAfter() {
        return Optional.ofNullable(after);
    }

    public static DateQuery of(Instant before, Instant after) {
        return new DateQuery(before, after);
    }
}
