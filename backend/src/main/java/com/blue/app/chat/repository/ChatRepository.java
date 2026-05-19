package com.blue.app.chat.repository;

import java.util.Collection;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.blue.app.chat.models.Chat;

public interface ChatRepository extends MongoRepository<Chat, String> {

    Page<Chat> findByIdIn(Collection<String> ids, Pageable pageable);
}
