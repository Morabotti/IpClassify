package fi.morabotti.ipclassify.dto;

import fi.morabotti.ipclassify.domain.IpClassification;
import fi.morabotti.ipclassify.domain.LocationRecord;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import reactor.util.annotation.Nullable;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class IpInformation {
    private String ip;

    @Nullable
    private IpClassification classification;

    @Nullable
    private LocationRecord location;
}
