package com.blue.app.chat.dto.ws;

public record ChatListEvent(String chatId) {

    public static final String CHAT_ADDED = "CHAT_ADDED";
    public static final String CHAT_REMOVED = "CHAT_REMOVED";
    public static final String CHAT_UPDATED = "CHAT_UPDATED";
}
