package fi.morabotti.ipclassify.service;

import fi.morabotti.ipclassify.domain.AccessRecord;
import fi.morabotti.ipclassify.dto.AccessSummary;
import fi.morabotti.ipclassify.dto.TrafficSummary;
import fi.morabotti.ipclassify.dto.common.Pagination;
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

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.IntStream;

@Service
@AllArgsConstructor
public class AccessRecordService {
    private final CustomAccessRecordRepository customAccessRecordRepository;
    private final AccessRecordRepository accessRecordRepository;

    public static final Long FETCH_INTERVAL = 1L;
    public static final Long HISTORY_SIZE = 60L;

    public Mono<Pagination<AccessRecord>> getPagination(
            PaginationQuery pagination,
            SortQuery sort,
            DateQuery dateQuery
    ) {
        return customAccessRecordRepository.getPaginated(
                QueryUtility.toPageable(pagination, sort),
                dateQuery
        );
    };

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
        return customAccessRecordRepository.getMostCommonAggregatedBy(
                date,
                aggregation,
                common.getLevel()
        );
    }

    public Flux<TrafficSummary> getBackTrackedSummary(Long size) {
        Instant now = Instant.now();

        List<Long> allIntervals = IntStream.range(0, size.intValue())
                .asLongStream()
                .boxed()
                .toList()
                .reversed();

        return customAccessRecordRepository.getRecordsFromLastSeconds(size * FETCH_INTERVAL)
                .groupBy(groupAccessRecords(now))
                .flatMap(group -> group.collectList()
                        .map(records -> Map.entry(group.key(), records)))
                .collectMap(Map.Entry::getKey, Map.Entry::getValue)
                .flatMapMany(map -> Flux.fromIterable(allIntervals)
                        .map(i -> {
                            List<AccessRecord> record = map.getOrDefault(i, List.of());
                            return TrafficSummary.builder()
                                    .time(now.minusSeconds(i * FETCH_INTERVAL))
                                    .danger(record.stream().filter(AccessRecord::getDanger).count())
                                    .warning(record.stream().filter(AccessRecord::getWarning).count())
                                    .normal(record.stream()
                                            .filter(r -> !r.getWarning() && !r.getDanger())
                                            .count())
                                    .build();
                        })
                );
    }

    private static Function<AccessRecord, Long> groupAccessRecords(Instant now) {
        return record -> {
            long secondsAgo = now.toEpochMilli() - record.getCreatedAt().toEpochMilli();
            return secondsAgo / (FETCH_INTERVAL * 1000);
        };
    }
}
