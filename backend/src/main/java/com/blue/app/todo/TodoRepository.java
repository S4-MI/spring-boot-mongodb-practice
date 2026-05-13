package com.blue.app.todo;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TodoRepository extends MongoRepository<Todo, String> {
    Page<Todo> findByUserId(String userId, Pageable pageable);

    Optional<Todo> findByIdAndUserId(String id, String userId);
}
