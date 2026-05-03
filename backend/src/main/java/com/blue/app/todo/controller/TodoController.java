package com.blue.app.todo.controller;

import com.blue.app.dto.PagedResponse;
import com.blue.app.todo.dto.TodoCreateRequest;
import com.blue.app.todo.dto.TodoResponse;
import com.blue.app.todo.dto.TodoUpdateRequest;
import com.blue.app.todo.service.TodoService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
@AllArgsConstructor
public class TodoController {
    private final TodoService service;

    @GetMapping("/todos")
    public PagedResponse<TodoResponse> getAllTodos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return PagedResponse.from(service.getAllTodos(page, size).map(TodoResponse::from));
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
