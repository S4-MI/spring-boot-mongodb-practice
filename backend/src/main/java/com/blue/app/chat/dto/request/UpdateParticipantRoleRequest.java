package com.blue.app.chat.dto.request;

import com.blue.app.chat.models.Role;

import jakarta.validation.constraints.NotNull;

public record UpdateParticipantRoleRequest(
        @NotNull Role role) {
}
