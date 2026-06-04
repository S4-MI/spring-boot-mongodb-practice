package com.blue.app.chat.models;

import com.fasterxml.jackson.annotation.JsonValue;

public enum MessageType {
    TEXT,
    SYSTEM;

    @JsonValue
    public String getValue() {
        return name().toLowerCase();
    }
}
