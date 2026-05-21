package com.blue.app.chat;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blue.app.chat.dto.request.AddParticipantRequest;
import com.blue.app.chat.dto.request.CreateChatRequest;
import com.blue.app.chat.dto.request.SendMessageRequest;
import com.blue.app.chat.dto.request.UpdateChatRequest;
import com.blue.app.chat.dto.request.UpdateParticipantRoleRequest;
import com.blue.app.chat.dto.response.ChatResponse;
import com.blue.app.chat.dto.response.MessageResponse;
import com.blue.app.chat.dto.response.ParticipantResponse;
import com.blue.app.users.User;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/v1/chats")
@PreAuthorize("isAuthenticated()")
@AllArgsConstructor
@Tag(name = "Chat", description = "Chat management endpoints")
public class ChatController {

    private final ChatService service;

    // ── Chat ──────────────────────────────────────────────────────────────────

    @GetMapping
    public Page<ChatResponse> listChats(
            Authentication auth,
            @PageableDefault(size = 20, sort = "createdAt", direction = Direction.DESC) Pageable pageable) {
        String userId = ((User) auth.getPrincipal()).getId();
        return service.listChats(userId, pageable);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ChatResponse> createChat(
            Authentication auth,
            @RequestBody @Valid CreateChatRequest request) {
        String userId = ((User) auth.getPrincipal()).getId();
        ChatResponse created = ChatResponse.from(service.createChat(request.name(), request.description(), userId));
        return ResponseEntity.status(201).body(created);
    }

    @GetMapping("/{chatId}")
    public ChatResponse getChat(Authentication auth, @PathVariable String chatId) {
        String userId = ((User) auth.getPrincipal()).getId();
        return ChatResponse.from(service.getChat(chatId, userId));
    }

    @PutMapping(value = "/{chatId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ChatResponse updateChat(
            Authentication auth,
            @PathVariable String chatId,
            @RequestBody @Valid UpdateChatRequest request) {
        String userId = ((User) auth.getPrincipal()).getId();
        return ChatResponse.from(service.updateChat(chatId, request.name(), request.description(), userId));
    }

    @DeleteMapping("/{chatId}")
    public ResponseEntity<Void> deleteChat(Authentication auth, @PathVariable String chatId) {
        String userId = ((User) auth.getPrincipal()).getId();
        service.deleteChat(chatId, userId);
        return ResponseEntity.noContent().build();
    }

    // ── Messages ──────────────────────────────────────────────────────────────

    @GetMapping("/{chatId}/messages")
    public Page<MessageResponse> listMessages(
            Authentication auth,
            @PathVariable String chatId,
            @PageableDefault(size = 50, sort = "createdAt", direction = Direction.ASC) Pageable pageable) {
        String userId = ((User) auth.getPrincipal()).getId();
        return service.listMessages(chatId, userId, pageable);
    }

    @PostMapping(value = "/{chatId}/messages", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MessageResponse> sendMessage(
            Authentication auth,
            @PathVariable String chatId,
            @RequestBody @Valid SendMessageRequest request) {
        String userId = ((User) auth.getPrincipal()).getId();
        MessageResponse sent = MessageResponse.from(service.sendMessage(chatId, request.content(), userId));
        return ResponseEntity.status(201).body(sent);
    }

    @PatchMapping(value = "/{chatId}/messages/{messageId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public MessageResponse editMessage(
            Authentication auth,
            @PathVariable String chatId,
            @PathVariable String messageId,
            @RequestBody @Valid SendMessageRequest request) {
        String userId = ((User) auth.getPrincipal()).getId();
        return MessageResponse.from(service.editMessage(chatId, messageId, request.content(), userId));
    }

    @DeleteMapping("/{chatId}/messages/{messageId}")
    public ResponseEntity<Void> deleteMessage(
            Authentication auth,
            @PathVariable String chatId,
            @PathVariable String messageId) {
        String userId = ((User) auth.getPrincipal()).getId();
        service.deleteMessage(chatId, messageId, userId);
        return ResponseEntity.noContent().build();
    }

    // ── Participants ──────────────────────────────────────────────────────────

    @GetMapping("/{chatId}/participants")
    public List<ParticipantResponse> listParticipants(Authentication auth, @PathVariable String chatId) {
        String userId = ((User) auth.getPrincipal()).getId();
        return service.listParticipants(chatId, userId);
    }

    @PostMapping(value = "/{chatId}/participants", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ParticipantResponse> addParticipant(
            Authentication auth,
            @PathVariable String chatId,
            @RequestBody @Valid AddParticipantRequest request) {
        String userId = ((User) auth.getPrincipal()).getId();
        ParticipantResponse added = service.addParticipant(chatId, request.userId(), request.role(), userId);
        return ResponseEntity.status(201).body(added);
    }

    @PatchMapping(value = "/{chatId}/participants/{userId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ParticipantResponse updateParticipantRole(
            Authentication auth,
            @PathVariable String chatId,
            @PathVariable String userId,
            @RequestBody @Valid UpdateParticipantRoleRequest request) {
        String requesterId = ((User) auth.getPrincipal()).getId();
        return service.updateParticipantRole(chatId, userId, request.role(), requesterId);
    }

    @DeleteMapping("/{chatId}/participants/{userId}")
    public ResponseEntity<Void> removeParticipant(
            Authentication auth,
            @PathVariable String chatId,
            @PathVariable String userId) {
        String requesterId = ((User) auth.getPrincipal()).getId();
        service.removeParticipant(chatId, userId, requesterId);
        return ResponseEntity.noContent().build();
    }
}
