package com.blue.app.chat;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.blue.app.chat.dto.response.MessageResponse;
import com.blue.app.chat.dto.ws.ChatListEvent;
import com.blue.app.chat.dto.ws.WsEnvelope;

import lombok.RequiredArgsConstructor;

/**
 * Single home for chat WebSocket broadcasts. Keeps topic strings in one place
 * and out of the service/controller flow.
 */
@Service
@RequiredArgsConstructor
public class ChatEventPublisher {

    private final SimpMessagingTemplate messagingTemplate;

    /** Push a new message (text or system) to everyone viewing the chat. */
    public void messageCreated(String chatId, MessageResponse message) {
        messagingTemplate.convertAndSend("/topic/chats/" + chatId + "/messages", message);
    }

    /** Notify a single user that their chat list changed. */
    public void chatListChanged(String userId, String type, String chatId) {
        WsEnvelope<ChatListEvent> envelope = WsEnvelope.event(type, new ChatListEvent(chatId));
        messagingTemplate.convertAndSend("/topic/users/" + userId + "/chats", envelope);
    }
}
