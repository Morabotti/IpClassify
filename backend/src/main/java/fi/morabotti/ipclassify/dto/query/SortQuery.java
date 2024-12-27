package fi.morabotti.ipclassify.dto.query;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
}
