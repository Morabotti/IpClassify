package fi.morabotti.ipclassify.controller;

import fi.morabotti.ipclassify.domain.AccessRecord;
import fi.morabotti.ipclassify.dto.AccessSummary;
import fi.morabotti.ipclassify.dto.common.Pagination;
import fi.morabotti.ipclassify.dto.query.AggregationQuery;
import fi.morabotti.ipclassify.dto.query.CommonQuery;
import fi.morabotti.ipclassify.dto.query.DateQuery;
import fi.morabotti.ipclassify.dto.query.PaginationQuery;
import fi.morabotti.ipclassify.dto.query.SortQuery;
import fi.morabotti.ipclassify.service.AccessRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/v1/access")
public class AccessController {
    private final AccessRecordService accessRecordService;

    @GetMapping
    public Mono<Pagination<AccessRecord>> get(
            @ModelAttribute PaginationQuery pagination,
            @ModelAttribute SortQuery sort,
            @ModelAttribute DateQuery date
    ){
        return accessRecordService.getPagination(pagination, sort, date);
    }

    @GetMapping("/{id}")
    public Mono<AccessRecord> get(@PathVariable("id") String id){
        return accessRecordService.getById(id);
    }

    @GetMapping("/summary")
    public Flux<AccessSummary> get(
            @ModelAttribute DateQuery date,
            @ModelAttribute @Valid AggregationQuery aggregation,
            @ModelAttribute CommonQuery common
    ) {
        return accessRecordService.getCommonRecords(date, aggregation, common);
    }
}
