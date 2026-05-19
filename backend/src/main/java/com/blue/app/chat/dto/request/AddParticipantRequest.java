package com.blue.app.chat.dto.request;

import com.blue.app.chat.models.Role;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AddParticipantRequest(
        @NotBlank String userId,
        @NotNull Role role) {
}
