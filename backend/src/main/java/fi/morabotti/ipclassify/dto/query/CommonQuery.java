package fi.morabotti.ipclassify.dto.query;

import fi.morabotti.ipclassify.dto.TrafficLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import reactor.util.annotation.Nullable;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommonQuery {
    @Nullable
    private TrafficLevel level;

    @Nullable
    private String search;

    public CommonQuery decode() {
        if (search != null) setSearch(URLDecoder.decode(search, StandardCharsets.UTF_8));
        return this;
    }
}
