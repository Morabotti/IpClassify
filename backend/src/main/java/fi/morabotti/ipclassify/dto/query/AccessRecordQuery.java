package fi.morabotti.ipclassify.dto.query;

import fi.morabotti.ipclassify.dto.TrafficLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import reactor.util.annotation.Nullable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccessRecordQuery {
    @Nullable
    private String ip;

    @Nullable
    private String country;

    @Nullable
    private String zip;

    @Nullable
    private String city;

    @Nullable
    private String application;
}
