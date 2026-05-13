package com.blue.app.todo.dto;

import com.blue.app.todo.Todo;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

public record TodoResponse(
        String id,
        String title,
        String description,
        boolean completed,
        @JsonProperty("created_at") LocalDateTime createdAt,
        @JsonProperty("updated_at") LocalDateTime updatedAt) {
    public static TodoResponse from(Todo todo) {
        return new TodoResponse(
                todo.getId(),
                todo.getTitle(),
                todo.getDescription(),
                todo.isCompleted(),
                todo.getCreatedAt(),
                todo.getUpdatedAt()
        );
    }
}
