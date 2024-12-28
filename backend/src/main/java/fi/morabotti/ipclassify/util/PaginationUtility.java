package fi.morabotti.ipclassify.util;

import fi.morabotti.ipclassify.dto.query.PaginationQuery;
import fi.morabotti.ipclassify.dto.query.SortQuery;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public class PaginationUtility {
    public static Pageable toPageable(
            PaginationQuery pagination,
            SortQuery sort
    ) {
        int page = pagination.getOptionalPage()
                .orElse(0);

        int size = pagination.getOptionalRows()
                .orElse(50);

        if (sort == null) {
            return PageRequest.of(page, size);
        }

        Sort.Direction direction = sort.getDirection() == SortQuery.Order.ASC
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        return PageRequest.of(page, size, Sort.by(direction, sort.getSort()));
    }
}
