package fi.morabotti.ipclassify.util;

import fi.morabotti.ipclassify.dto.TrafficLevel;
import fi.morabotti.ipclassify.dto.query.AccessRecordQuery;
import fi.morabotti.ipclassify.dto.query.CommonQuery;
import fi.morabotti.ipclassify.dto.query.DateQuery;
import fi.morabotti.ipclassify.dto.query.PaginationQuery;
import fi.morabotti.ipclassify.dto.query.SortQuery;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.elasticsearch.core.query.Criteria;
import org.springframework.data.elasticsearch.core.query.CriteriaQuery;

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

    public static Criteria.CriteriaChain commonToAccessRecordCriteriaChain(CommonQuery query) {
        Criteria.CriteriaChain chain = new Criteria.CriteriaChain();

        if (query.getLevel() != null) {
            chain.add(toCriteria(query.getLevel()));
        }

        if (query.getSearch() != null) {
            Criteria zipCriteria = Criteria.where("zip").contains(query.getSearch());
            Criteria countryCriteria = Criteria.where("country").contains(query.getSearch());

            chain.add(
                    new Criteria()
                            .or(zipCriteria)
                            .or(countryCriteria)
            );
        }

        return chain;
    }

    public static Criteria.CriteriaChain toCriteriaChain(AccessRecordQuery query) {
        Criteria.CriteriaChain chain = new Criteria.CriteriaChain();

        if (query.getIp() != null) {
            chain.add(Criteria.where("ip").is(query.getIp()));
        }

        if (query.getZip() != null) {
            chain.add(Criteria.where("zip").is(query.getZip()));
        }

        if (query.getCountry() != null) {
            chain.add(Criteria.where("country").is(query.getCountry()));
        }

        if (query.getCity() != null) {
            chain.add(Criteria.where("city").is(query.getCity()));
        }

        if (query.getApplication() != null) {
            chain.add(Criteria.where("application").is(query.getApplication()));
        }

        return chain;
   }

   public static void applyToQuery(CriteriaQuery query, Criteria.CriteriaChain criteriaChain) {
        for (Criteria criteria : criteriaChain) {
            query.addCriteria(criteria);
        }
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

    public static Criteria toCriteria(TrafficLevel level) {
        if (level == TrafficLevel.DANGER) {
            return Criteria.where("danger").is(true);
        }

        if (level == TrafficLevel.WARNING) {
            return Criteria.where("warning").is(true);
        }

        return Criteria.where("danger")
                .is(false)
                .and("warning")
                .is(false);
    }
}
