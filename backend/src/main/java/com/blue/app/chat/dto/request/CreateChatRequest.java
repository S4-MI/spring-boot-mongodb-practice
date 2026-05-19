package com.blue.app.chat.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateChatRequest(
        @NotBlank @Size(min = 2, max = 30) String name,
        @Size(max = 500) String description) {
}
