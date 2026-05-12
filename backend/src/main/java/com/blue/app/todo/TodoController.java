package com.blue.app.todo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blue.app.todo.dto.TodoCreateRequest;
import com.blue.app.todo.dto.TodoResponse;
import com.blue.app.todo.dto.TodoUpdateRequest;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/v1")
@AllArgsConstructor
public class TodoController {
    private final TodoService service;

    @GetMapping("/todos")
    public Page<TodoResponse> list(
            @PageableDefault(size = 10, sort = "created_at", direction = Direction.DESC) Pageable pageable) {
        return service.list(pageable);
    }

    @PostMapping(value = "/todos", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TodoResponse> createTodo(@RequestBody @Valid TodoCreateRequest request) {
        TodoResponse created = TodoResponse.from(service.createTodo(request.title(), request.description()));
        return ResponseEntity.status(201).body(created);
    }

    @GetMapping("/todos/{id}")
    public TodoResponse getTodoById(@PathVariable String id) {
        return TodoResponse.from(service.getTodoById(id));
    }

    @PutMapping(value = "/todos/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public TodoResponse updateTodo(@PathVariable String id, @RequestBody @Valid TodoUpdateRequest request) {
        return TodoResponse.from(service.updateTodo(id, request.title(), request.description(), request.completed()));
    }

    @DeleteMapping("/todos/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable String id) {
        service.deleteTodo(id);
        return ResponseEntity.noContent().build();
    }
}
