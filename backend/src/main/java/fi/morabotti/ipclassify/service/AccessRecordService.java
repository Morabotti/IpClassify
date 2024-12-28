package fi.morabotti.ipclassify.service;

import fi.morabotti.ipclassify.domain.AccessRecord;
import fi.morabotti.ipclassify.dto.common.Pagination;
import fi.morabotti.ipclassify.dto.query.PaginationQuery;
import fi.morabotti.ipclassify.dto.query.SortQuery;
import fi.morabotti.ipclassify.repository.AccessRecordRepository;
import fi.morabotti.ipclassify.repository.CustomAccessRecordRepository;
import fi.morabotti.ipclassify.util.PaginationUtility;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@AllArgsConstructor
public class AccessRecordService {
    private final CustomAccessRecordRepository customAccessRecordRepository;
    private final AccessRecordRepository accessRecordRepository;

    public Mono<Pagination<AccessRecord>> getPagination(
            PaginationQuery pagination,
            SortQuery sort
    ) {
        return customAccessRecordRepository.getPaginated(PaginationUtility.toPageable(pagination, sort));
    };

    public Mono<AccessRecord> getById(String id) {
        return accessRecordRepository.findById(id);
    }

    public Mono<Boolean> deleteById(String id) {
        return accessRecordRepository.deleteById(id)
                .thenReturn(true)
                .onErrorReturn(false);
    }
}
