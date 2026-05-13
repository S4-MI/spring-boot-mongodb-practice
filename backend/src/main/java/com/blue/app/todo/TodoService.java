package com.blue.app.todo;

import com.blue.app.exception.ResourceNotFound;
import com.blue.app.todo.dto.TodoResponse;
import com.mongodb.client.result.DeleteResult;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class TodoService {
    final TodoRepository repository;
    final MongoTemplate mongoTemplate;

    public Page<TodoResponse> list(String userId, Pageable pageable) {
        return repository.findByUserId(userId, pageable).map(TodoResponse::from);
    }

    public Todo getTodoById(String id, String userId) {
        return repository.findByIdAndUserId(id, userId).orElseThrow(() -> new ResourceNotFound("Todo", id));
    }

    public Todo createTodo(String title, String description, String userId) {
        Todo todo = Todo
                .builder()
                .userId(userId)
                .title(title)
                .description(description)
                .completed(false)
                .build();

        return repository.save(todo);
    }

    public Todo updateTodo(String id, String title, String description, Boolean completed, String userId) {
        Todo todo = repository.findByIdAndUserId(id, userId).orElseThrow(() -> new ResourceNotFound("Todo", id));

        todo.setTitle(title);
        todo.setDescription(description);

        if (completed != null)
            todo.setCompleted(completed);

        return repository.save(todo);
    }

    public void deleteTodo(String id, String userId) {
        Query query = new Query(Criteria.where("_id").is(id).and("userId").is(userId));
        DeleteResult result = mongoTemplate.remove(query, Todo.class);
        if (result.getDeletedCount() == 0) {
            throw new ResourceNotFound("Todo", id);
        }
    }
}
