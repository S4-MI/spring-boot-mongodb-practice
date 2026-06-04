package com.blue.app.chat;

import java.security.Principal;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;

import com.blue.app.chat.dto.request.SendMessageRequest;
import com.blue.app.users.User;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@Validated
@RequiredArgsConstructor
public class ChatWSController {

    private final ChatService chatService;

    // ── Send message ───────────────────────────────────────────────────────────
    // Service broadcasts to /topic/chats/{chatId}/messages via ChatEventPublisher,
    // so no @SendTo here (would double-publish).
    @MessageMapping("/chats/{chatId}/send")
    public void sendMessage(
            @DestinationVariable String chatId,
            @Payload @Valid SendMessageRequest request,
            @Header(name = "correlation-id", required = false) String correlationId,
            Principal principal) {

        String userId = getUserId(principal);
        chatService.sendMessage(chatId, request.content(), userId);
    }

    private static String getUserId(Principal principal) {
        User user = (User) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();
        return user.getId();
    }
}
