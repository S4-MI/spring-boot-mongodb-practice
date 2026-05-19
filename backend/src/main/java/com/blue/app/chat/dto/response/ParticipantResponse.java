package com.blue.app.chat.dto.response;

import java.time.Instant;

import com.blue.app.chat.models.ChatParticipant;
import com.blue.app.chat.models.Role;

public record ParticipantResponse(
        String id,
        String chatId,
        String userId,
        Role role,
        Instant createdAt) {

    public static ParticipantResponse from(ChatParticipant p) {
        return new ParticipantResponse(
                p.getId(),
                p.getChatId(),
                p.getUserId(),
                p.getRole(),
                p.getCreatedAt());
    }
}
