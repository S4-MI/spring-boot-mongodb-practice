package com.blue.app.chat.dto.ws;

public record WsEnvelope<T>(
        String correlationId,
        String type,
        boolean ok,
        T data,
        String error) {

    public static <T> WsEnvelope<T> reply(String correlationId, T data) {
        return new WsEnvelope<>(correlationId, "REPLY", true, data, null);
    }

    public static <T> WsEnvelope<T> replyError(String correlationId, String error) {
        return new WsEnvelope<>(correlationId, "REPLY", false, null, error);
    }

    public static <T> WsEnvelope<T> event(String type, T data) {
        return new WsEnvelope<>(null, type, true, data, null);
    }
}
