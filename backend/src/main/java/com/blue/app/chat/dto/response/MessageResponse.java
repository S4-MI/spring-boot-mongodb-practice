package com.blue.app.chat.dto.response;

import java.time.Instant;

import com.blue.app.chat.models.Message;
import com.blue.app.chat.models.MessageType;

public record MessageResponse(
        String id,
        String chatId,
        String senderId,
        String content,
        MessageType type,
        Instant createdAt,
        Instant updatedAt) {

    public static MessageResponse from(Message message) {
        return new MessageResponse(
                message.getId(),
                message.getChatId(),
                message.getSenderId(),
                message.getContent(),
                message.getType(),
                message.getCreatedAt(),
                message.getUpdatedAt());
    }
}
