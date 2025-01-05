package fi.morabotti.ipclassify.service;

import fi.morabotti.ipclassify.domain.AccessRecord;
import fi.morabotti.ipclassify.dto.AccessSummary;
import fi.morabotti.ipclassify.dto.IpInformation;
import fi.morabotti.ipclassify.dto.TrafficLevel;
import fi.morabotti.ipclassify.dto.TrafficSummary;
import fi.morabotti.ipclassify.dto.common.Pagination;
import fi.morabotti.ipclassify.dto.query.AccessRecordQuery;
import fi.morabotti.ipclassify.dto.query.AggregationQuery;
import fi.morabotti.ipclassify.dto.query.CommonQuery;
import fi.morabotti.ipclassify.dto.query.DateQuery;
import fi.morabotti.ipclassify.dto.query.PaginationQuery;
import fi.morabotti.ipclassify.dto.query.SortQuery;
import fi.morabotti.ipclassify.repository.AccessRecordRepository;
import fi.morabotti.ipclassify.repository.CustomAccessRecordRepository;
import fi.morabotti.ipclassify.util.QueryUtility;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@AllArgsConstructor
public class AccessRecordService {
    private final CustomAccessRecordRepository customAccessRecordRepository;
    private final AccessRecordRepository accessRecordRepository;
    private final IpClassificationService ipClassificationService;
    private final IpLocationService ipLocationService;

    public static final Long FETCH_INTERVAL = 1L;
    public static final Long HISTORY_SIZE = 60L;

    public Mono<Pagination<AccessRecord>> getPagination(
            PaginationQuery pagination,
            SortQuery sort,
            DateQuery date,
            CommonQuery common,
            AccessRecordQuery query
    ) {
        return customAccessRecordRepository.getPaginated(
                QueryUtility.toPageable(pagination, sort),
                date,
                common,
                query
        );
    };

    public Mono<IpInformation> getInformationByIp(String ip) {
        return Mono.zip(
                ipClassificationService.getIpClassification(ip),
                ipLocationService.getLocationRecord(ip)
        )
                .flatMap(tuple -> Mono.just(IpInformation.builder()
                        .ip(ip)
                        .classification(tuple.getT1())
                        .location(tuple.getT2())
                        .build()));
    }

    public Mono<AccessRecord> getById(String id) {
        return accessRecordRepository.findById(id);
    }

    public Mono<Boolean> deleteById(String id) {
        return accessRecordRepository.deleteById(id)
                .thenReturn(true)
                .onErrorReturn(false);
    }

    public Flux<AccessSummary> getCommonRecords(
            DateQuery date,
            AggregationQuery aggregation,
            CommonQuery common
    ) {
        Flux<AccessSummary> result = customAccessRecordRepository.getMostCommonAggregatedBy(
                date,
                aggregation,
                common.getLevel()
        );

        // Only support dynamic level setting with ip aggregations.
        if (common.getLevel() == null && aggregation.getField().equals("ip")) {
            return result.flatMap(i -> ipClassificationService.getIpClassification(i.getLabel())
                    .map(TrafficLevel::from)
                    .map(level -> i.toBuilder().level(level).build()));
        }

        return result;
    }

    public Flux<TrafficSummary> getBackTrackedSummary(Long size) {
        return customAccessRecordRepository.getBackTrackedRecords(size);
    }

    public Flux<String> getUniqueIps() {
        return customAccessRecordRepository.getMostCommonAggregatedBy(
                new DateQuery(),
                new AggregationQuery("ip", 100000),
                null
        )
                .map(AccessSummary::getLabel);
    }
}
