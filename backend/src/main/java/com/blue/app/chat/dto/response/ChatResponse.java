package com.blue.app.chat.dto.response;

import java.time.Instant;

import com.blue.app.chat.models.Chat;

public record ChatResponse(
        String id,
        String name,
        String description,
        String creatorId,
        Instant createdAt,
        Instant updatedAt) {

    public static ChatResponse from(Chat chat) {
        return new ChatResponse(
                chat.getId(),
                chat.getName(),
                chat.getDescription(),
                chat.getCreatorId(),
                chat.getCreatedAt(),
                chat.getUpdatedAt());
    }
}
