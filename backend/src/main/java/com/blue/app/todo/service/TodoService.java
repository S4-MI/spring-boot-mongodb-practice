package com.blue.app.todo.service;

import com.blue.app.exception.ResourceNotFound;
import com.blue.app.todo.model.Todo;
import com.blue.app.todo.repository.TodoRepository;
import com.mongodb.client.result.DeleteResult;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class TodoService {
    final TodoRepository repository;
    final MongoTemplate mongoTemplate;

    public Page<Todo> getAllTodos(int page, int size) {
        return repository.findAll(PageRequest.of(page, size));
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
