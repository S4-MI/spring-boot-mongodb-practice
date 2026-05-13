package com.blue.app.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponse(String message, LocalDateTime timestamp, Map<String, String> fieldErrors, String code) {
    public ErrorResponse(String message, LocalDateTime timestamp) {
        this(message, timestamp, null, null);
    }

    public ErrorResponse(String message, LocalDateTime timestamp, String code) {
        this(message, timestamp, null, code);
    }

    public ErrorResponse(String message, LocalDateTime timestamp, Map<String, String> fieldErrors) {
        this(message, timestamp, fieldErrors, null);
    }
}
