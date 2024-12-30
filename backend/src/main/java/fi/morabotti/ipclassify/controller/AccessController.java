package fi.morabotti.ipclassify.controller;

import fi.morabotti.ipclassify.domain.AccessRecord;
import fi.morabotti.ipclassify.domain.IpClassification;
import fi.morabotti.ipclassify.dto.AccessSummary;
import fi.morabotti.ipclassify.dto.IpClassifyRequest;
import fi.morabotti.ipclassify.dto.IpInformation;
import fi.morabotti.ipclassify.dto.common.Pagination;
import fi.morabotti.ipclassify.dto.query.AccessRecordQuery;
import fi.morabotti.ipclassify.dto.query.AggregationQuery;
import fi.morabotti.ipclassify.dto.query.CommonQuery;
import fi.morabotti.ipclassify.dto.query.DateQuery;
import fi.morabotti.ipclassify.dto.query.PaginationQuery;
import fi.morabotti.ipclassify.dto.query.SortQuery;
import fi.morabotti.ipclassify.service.AccessRecordService;
import fi.morabotti.ipclassify.service.IpClassificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/v1/access")
public class AccessController {
    private final AccessRecordService accessRecordService;
    private final IpClassificationService ipClassificationService;

    @GetMapping
    public Mono<Pagination<AccessRecord>> get(
            @ModelAttribute PaginationQuery pagination,
            @ModelAttribute SortQuery sort,
            @ModelAttribute DateQuery date,
            @ModelAttribute AccessRecordQuery query
    ){
        return accessRecordService.getPagination(pagination, sort, date, query);
    }

    @GetMapping("/{ip}")
    public Mono<IpInformation> get(@PathVariable("ip") String ip){
        return accessRecordService.getInformationByIp(ip);
    }

    @PutMapping("/{ip}/classify")
    public Mono<IpClassification> update(@RequestBody IpClassifyRequest request) {
        return ipClassificationService.update(request);
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
