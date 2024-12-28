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
public class SortQuery {
    public enum Order {
        ASC,
        DESC
    }

    private String sort;
    private Order direction;

    public Optional<String> getOptionalSort() {
        return Optional.ofNullable(sort);
    }

    public Optional<Order> getOptionalDirection() {
        return Optional.ofNullable(direction);
    }
}
