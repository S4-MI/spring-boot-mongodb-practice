package com.blue.app.chat.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.blue.app.chat.models.ChatParticipant;
import com.blue.app.chat.models.Role;

public interface ChatParticipantRepository extends MongoRepository<ChatParticipant, String> {

    List<ChatParticipant> findByChatId(String chatId);

    List<ChatParticipant> findByUserId(String userId);

    Optional<ChatParticipant> findByChatIdAndUserId(String chatId, String userId);

    boolean existsByChatIdAndUserId(String chatId, String userId);

    List<ChatParticipant> findByChatIdAndRole(String chatId, Role role);

    void deleteByChatId(String chatId);

    void deleteByChatIdAndUserId(String chatId, String userId);
}
