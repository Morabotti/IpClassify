package fi.morabotti.ipclassify.dto.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import reactor.util.annotation.Nullable;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WSMessage<T> {
    public enum MessageType {
        ECHO,
        INTERVAL_RESPONSE
    }

    private MessageType type;

    @Nullable
    private T data;
}
