package fi.morabotti.ipclassify.dto.common;

import jakarta.annotation.Nullable;

public class WebSocketMessage<T> {
    public enum MessageType {
        TEST
    }

    private MessageType type;

    @Nullable
    private T data;
}
