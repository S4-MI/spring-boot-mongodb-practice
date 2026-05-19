package com.blue.app.chat.models;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Role {
    MEMBER,
    MODERATOR,
    ADMIN;

    @JsonValue
    public String getValue() {
        return name().toLowerCase();
    }
}
