package fi.morabotti.ipclassify.dto.common;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class Pagination<T> {
    private List<T> result;
    private Long count;
}
