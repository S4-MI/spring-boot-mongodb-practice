package com.blue.app.chat.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.blue.app.chat.models.Message;

public interface MessageRepository extends MongoRepository<Message, String> {

    Page<Message> findByChatId(String chatId, Pageable pageable);

    void deleteByChatId(String chatId);
}
