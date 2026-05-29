package com.blue.app.chat;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.blue.app.chat.dto.response.ChatResponse;
import com.blue.app.chat.dto.response.MessageResponse;
import com.blue.app.chat.dto.response.ParticipantResponse;
import com.blue.app.chat.dto.ws.ChatListEvent;
import com.blue.app.chat.models.Chat;
import com.blue.app.chat.models.ChatParticipant;
import com.blue.app.chat.models.Message;
import com.blue.app.chat.models.MessageType;
import com.blue.app.chat.models.Role;
import com.blue.app.chat.repository.ChatParticipantRepository;
import com.blue.app.chat.repository.ChatRepository;
import com.blue.app.chat.repository.MessageRepository;
import com.blue.app.exception.ForbiddenException;
import com.blue.app.exception.ResourceNotFound;
import com.blue.app.users.User;
import com.blue.app.users.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;
    private final ChatParticipantRepository participantRepository;
    private final UserRepository userRepository;
    private final ChatEventPublisher events;

    // ── Chat ──────────────────────────────────────────────────────────────────

    public Page<ChatResponse> listChats(String userId, Pageable pageable) {
        List<String> chatIds = participantRepository.findByUserId(userId).stream()
                .map(p -> p.getChatId())
                .toList();

        return chatRepository.findByIdIn(chatIds, pageable).map(ChatResponse::from);
    }

    public Chat createChat(String name, String description, String creatorId) {
        Chat chat = Chat.builder()
                .name(name)
                .description(description)
                .creatorId(creatorId)
                .build();
        chat = chatRepository.save(chat);

        ChatParticipant participant = ChatParticipant.builder()
                .chatId(chat.getId())
                .userId(creatorId)
                .role(Role.ADMIN)
                .build();
        participantRepository.save(participant);

        events.chatListChanged(creatorId, ChatListEvent.CHAT_ADDED, chat.getId());
        return chat;
    }

    public Chat getChat(String chatId, String requesterId) {
        Chat chat = chatRepository.findById(chatId).orElseThrow(() -> new ResourceNotFound("Chat", chatId));
        requireParticipant(chatId, requesterId);
        return chat;
    }

    public Chat updateChat(String chatId, String name, String description, String requesterId) {
        Chat chat = requireChat(chatId);
        requireParticipant(chatId, requesterId);

        if (name != null)
            chat.setName(name);
        if (description != null)
            chat.setDescription(description);

        return chatRepository.save(chat);
    }

    public void deleteChat(String chatId, String requesterId) {
        requireChat(chatId);
        requireRole(chatId, requesterId, Role.ADMIN);

        messageRepository.deleteByChatId(chatId);
        participantRepository.deleteByChatId(chatId);
        chatRepository.deleteById(chatId);
    }

    // ── Messages ──────────────────────────────────────────────────────────────

    public Page<MessageResponse> listMessages(String chatId, String requesterId, Pageable pageable) {
        requireChat(chatId);
        requireParticipant(chatId, requesterId);
        return messageRepository.findByChatId(chatId, pageable).map(MessageResponse::from);
    }

    public Message sendMessage(String chatId, String content, String senderId) {
        requireChat(chatId);
        requireParticipant(chatId, senderId);

        Message message = Message.builder()
                .chatId(chatId)
                .content(content)
                .senderId(senderId)
                .build();

        message = messageRepository.save(message);
        events.messageCreated(chatId, MessageResponse.from(message));
        broadcastChatListUpdated(chatId);
        return message;
    }

    public Message editMessage(String chatId, String messageId, String content, String requesterId) {
        requireChat(chatId);
        Message message = messageRepository.findById(messageId)
                .filter(m -> m.getChatId().equals(chatId))
                .orElseThrow(() -> new ResourceNotFound("Message", messageId));

        if (!message.getSenderId().equals(requesterId)) {
            throw new ResourceNotFound("Message", messageId);
        }

        message.setContent(content);
        return messageRepository.save(message);
    }

    public void deleteMessage(String chatId, String messageId, String requesterId) {
        requireChat(chatId);
        Message message = messageRepository.findById(messageId)
                .filter(m -> m.getChatId().equals(chatId))
                .orElseThrow(() -> new ResourceNotFound("Message", messageId));

        boolean isSender = message.getSenderId().equals(requesterId);
        boolean isModerator = participantRepository.findByChatIdAndUserId(chatId, requesterId)
                .map(p -> p.getRole() == Role.MODERATOR || p.getRole() == Role.ADMIN)
                .orElse(false);

        if (!isSender && !isModerator) {
            throw new ForbiddenException("Not allowed to delete this message");
        }

        messageRepository.deleteById(messageId);
    }

    // ── Participants ──────────────────────────────────────────────────────────

    public List<ParticipantResponse> listParticipants(String chatId, String requesterId) {
        requireChat(chatId);
        requireParticipant(chatId, requesterId);
        return participantRepository.findByChatId(chatId).stream()
                .map(p -> {
                    User user = userRepository.findById(p.getUserId())
                            .orElseThrow(() -> new ResourceNotFound("User", p.getUserId()));
                    return ParticipantResponse.from(p, user);
                })
                .toList();
    }

    public ParticipantResponse addParticipant(String chatId, String userId, Role role, String requesterId) {
        requireChat(chatId);
        requireRole(chatId, requesterId, Role.ADMIN);

        ChatParticipant participant = ChatParticipant.builder()
                .chatId(chatId)
                .userId(userId)
                .role(role)
                .build();
        participant = participantRepository.save(participant);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFound("User", userId));

        String actorName = displayName(requesterId);
        systemMessage(chatId, requesterId, actorName + " added " + user.getName());

        // New participant learns the chat appeared; existing members see it bump.
        events.chatListChanged(userId, ChatListEvent.CHAT_ADDED, chatId);
        broadcastChatListUpdated(chatId);

        return ParticipantResponse.from(participant, user);
    }

    public ParticipantResponse updateParticipantRole(String chatId, String userId, Role role, String requesterId) {
        requireRole(chatId, requesterId, Role.ADMIN);

        ChatParticipant participant = participantRepository.findByChatIdAndUserId(chatId, userId)
                .orElseThrow(() -> new ResourceNotFound("Participant", userId));

        participant.setRole(role);
        participant = participantRepository.save(participant);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFound("User", userId));
        return ParticipantResponse.from(participant, user);
    }

    public void removeParticipant(String chatId, String userId, String requesterId) {
        requireChat(chatId);
        boolean isSelf = userId.equals(requesterId);
        if (!isSelf) {
            requireRole(chatId, requesterId, Role.ADMIN);
        }

        String targetName = displayName(userId);
        participantRepository.deleteByChatIdAndUserId(chatId, userId);

        String text = isSelf
                ? targetName + " left"
                : displayName(requesterId) + " removed " + targetName;
        systemMessage(chatId, requesterId, text);

        // Removed user drops the chat; remaining members see it bump.
        events.chatListChanged(userId, ChatListEvent.CHAT_REMOVED, chatId);
        broadcastChatListUpdated(chatId);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    /** Persist a SYSTEM message and broadcast it like any other message. */
    private void systemMessage(String chatId, String actorId, String text) {
        Message message = Message.builder()
                .chatId(chatId)
                .content(text)
                .senderId(actorId)
                .type(MessageType.SYSTEM)
                .build();
        message = messageRepository.save(message);
        events.messageCreated(chatId, MessageResponse.from(message));
    }

    /** Tell every participant of a chat that their chat list bumped. */
    private void broadcastChatListUpdated(String chatId) {
        participantRepository.findByChatId(chatId).forEach(
                p -> events.chatListChanged(p.getUserId(), ChatListEvent.CHAT_UPDATED, chatId));
    }

    private String displayName(String userId) {
        return userRepository.findById(userId)
                .map(User::getName)
                .orElse("Someone");
    }

    private Chat requireChat(String chatId) {
        return chatRepository.findById(chatId).orElseThrow(() -> new ResourceNotFound("Chat", chatId));
    }

    private void requireParticipant(String chatId, String userId) {
        if (!participantRepository.existsByChatIdAndUserId(chatId, userId)) {
            throw new ForbiddenException("Not a participant of this chat");
        }
    }

    private void requireRole(String chatId, String userId, Role minimumRole) {
        ChatParticipant p = participantRepository.findByChatIdAndUserId(chatId, userId)
                .orElseThrow(() -> new ResourceNotFound("Chat", chatId));

        boolean allowed = switch (minimumRole) {
            case ADMIN -> p.getRole() == Role.ADMIN;
            case MODERATOR -> p.getRole() == Role.MODERATOR || p.getRole() == Role.ADMIN;
            case MEMBER -> true;
        };

        if (!allowed) {
            throw new ForbiddenException("Insufficient role for this action");
        }
    }
}
