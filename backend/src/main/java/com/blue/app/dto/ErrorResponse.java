package com.blue.app.dto;

import java.time.LocalDateTime;
import java.util.Map;

public record ErrorResponse(String message, LocalDateTime timestamp, Map<String, String> fieldErrors) {
    public ErrorResponse(String message, LocalDateTime timestamp) {
        this(message, timestamp, null);
    }
}
