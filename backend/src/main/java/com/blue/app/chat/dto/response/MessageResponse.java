package com.blue.app.chat.dto.response;

import java.time.Instant;

import com.blue.app.chat.models.Message;

public record MessageResponse(
        String id,
        String chatId,
        String senderId,
        String content,
        Instant createdAt,
        Instant updatedAt) {

    public static MessageResponse from(Message message) {
        return new MessageResponse(
                message.getId(),
                message.getChatId(),
                message.getSenderId(),
                message.getContent(),
                message.getCreatedAt(),
                message.getUpdatedAt());
    }
}
