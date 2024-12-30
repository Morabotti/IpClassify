package fi.morabotti.ipclassify.dto;

import jakarta.validation.ValidationException;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import reactor.util.annotation.Nullable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IpClassifyRequest {
    private String ip;

    @Nullable
    private String id;

    private TrafficLevel level;
    private Boolean updateHistory;

    public Boolean isValid() {
        if (level == null || ip == null) {
            return false;
        }

        if (id != null && !id.isEmpty() && updateHistory) {
            return false;
        }

        return true;
    }
}
