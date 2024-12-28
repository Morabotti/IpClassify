package fi.morabotti.ipclassify.dto.query;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Optional;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaginationQuery {
    private Integer page;
    private Integer rows;

    public Optional<Integer> getOptionalPage() {
        return Optional.ofNullable(page);
    }

    public Optional<Integer> getOptionalRows() {
        return Optional.ofNullable(rows);
    }
}
