package fi.morabotti.ipclassify.util;

import fi.morabotti.ipclassify.dto.TrafficSummary;
import fi.morabotti.ipclassify.dto.query.DateQuery;
import fi.morabotti.ipclassify.dto.query.PaginationQuery;
import fi.morabotti.ipclassify.dto.query.SortQuery;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.elasticsearch.core.query.Criteria;

public class QueryUtility {
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

    public static Criteria toCriteria(String key, DateQuery dateQuery) {
        Criteria criteria = Criteria.where(key);

        if (dateQuery.getOptionalBefore().isPresent()) {
            criteria = criteria.lessThanEqual(dateQuery.getBefore());
        }

        if (dateQuery.getOptionalAfter().isPresent()) {
            criteria = criteria.greaterThanEqual(dateQuery.getAfter());
        }

        return criteria;
    }

    public static Criteria toCriteria(TrafficSummary.Level level) {
        if (level == TrafficSummary.Level.DANGER) {
            return Criteria.where("danger").is(true);
        }

        if (level == TrafficSummary.Level.WARNING) {
            return Criteria.where("warning").is(true);
        }

        return Criteria.where("danger")
                .is(false)
                .and("warning")
                .is(false);
    }
}
