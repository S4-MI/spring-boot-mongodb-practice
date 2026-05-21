package com.blue.app.chat.dto.response;

import java.time.Instant;

import com.blue.app.chat.models.ChatParticipant;
import com.blue.app.chat.models.Role;
import com.blue.app.users.User;

public record ParticipantResponse(
        String id,
        String chatId,
        UserProfile user,
        Role role,
        Instant createdAt) {

    public record UserProfile(String id, String name, String email) {
        public static UserProfile from(User u) {
            return new UserProfile(u.getId(), u.getName(), u.getEmail());
        }
    }

    public static ParticipantResponse from(ChatParticipant p, User user) {
        return new ParticipantResponse(
                p.getId(),
                p.getChatId(),
                UserProfile.from(user),
                p.getRole(),
                p.getCreatedAt());
    }
}
