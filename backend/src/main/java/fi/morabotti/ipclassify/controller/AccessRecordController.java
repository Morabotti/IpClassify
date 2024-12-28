package fi.morabotti.ipclassify.controller;

import fi.morabotti.ipclassify.domain.AccessRecord;
import fi.morabotti.ipclassify.dto.TrafficSummary;
import fi.morabotti.ipclassify.dto.common.Pagination;
import fi.morabotti.ipclassify.dto.query.PaginationQuery;
import fi.morabotti.ipclassify.dto.query.SortQuery;
import fi.morabotti.ipclassify.repository.AccessRecordRepository;
import fi.morabotti.ipclassify.service.AccessRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/v1/access-record")
public class AccessRecordController {
    private final AccessRecordService accessRecordService;

    @GetMapping
    public Mono<Pagination<AccessRecord>> get(
            @ModelAttribute PaginationQuery pagination,
            @ModelAttribute SortQuery sort
    ){
        return this.accessRecordService.getPagination(pagination, sort);
    }

    @GetMapping("/{id}")
    public Mono<AccessRecord> get(@PathVariable("id") String id){
        return this.accessRecordService.getById(id);
    }

    @GetMapping("/history")
    public Flux<TrafficSummary> getHistory(){
        return this.accessRecordService.getBackTrackedSummary(5L);
    }
}
