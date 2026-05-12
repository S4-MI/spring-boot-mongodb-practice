package com.blue.app.todo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.blue.app.exception.ResourceNotFound;
import com.blue.app.todo.dto.TodoResponse;
import com.mongodb.client.result.DeleteResult;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class TodoService {
    final TodoRepository repository;
    final MongoTemplate mongoTemplate;

    public Page<TodoResponse> list(Pageable pageable) {
        return repository.findAll(pageable).map(TodoResponse::from);
    }

    public Todo getTodoById(String id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFound("Todo", id));
    }

    public Todo createTodo(String title, String description) {
        Todo todo = Todo
                .builder()
                .title(title)
                .description(description)
                .completed(false)
                .build();

        return repository.save(todo);
    }

    public Todo updateTodo(String id, String title, String description, Boolean completed) {
        Todo todo = repository.findById(id).orElseThrow(() -> new ResourceNotFound("Todo", id));

        todo.setTitle(title);
        todo.setDescription(description);

        if (completed != null)
            todo.setCompleted(completed);

        return repository.save(todo);
    }

    public void deleteTodo(String id) {
        Query query = new Query(Criteria.where("_id").is(id));
        DeleteResult result = mongoTemplate.remove(query, Todo.class);
        if (result.getDeletedCount() == 0) {
            throw new ResourceNotFound("Todo", id);
        }
    }
}
