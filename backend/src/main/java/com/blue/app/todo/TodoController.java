package com.blue.app.todo;

import com.blue.app.todo.dto.TodoCreateRequest;
import com.blue.app.todo.dto.TodoResponse;
import com.blue.app.todo.dto.TodoUpdateRequest;
import com.blue.app.todo.export.TodoExportFormat;
import com.blue.app.todo.export.TodoExportService;
import com.blue.app.users.User;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
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
@PreAuthorize("isAuthenticated()")
@AllArgsConstructor
@Tag(name = "Todos", description = "Per-user todo CRUD with pagination")
public class TodoController {
    private final TodoService service;
    private final TodoExportService exportService;

    @GetMapping("/todos")
    public Page<TodoResponse> list(
            Authentication auth,
            @PageableDefault(size = 10, sort = "createdAt", direction = Direction.DESC) Pageable pageable
    ) {
        String userId = ((User) auth.getPrincipal()).getId();
        return service.list(userId, pageable);
    }

    @GetMapping("/todos/export")
    public ResponseEntity<byte[]> export(Authentication auth, @RequestParam TodoExportFormat format) {
        String userId = ((User) auth.getPrincipal()).getId();
        byte[] body = exportService.export(userId, format);

        return ResponseEntity
                .ok()
                .contentType(MediaType.parseMediaType(format.contentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename(exportService.fileName(format)).build().toString())
                .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.CONTENT_DISPOSITION)
                .body(body);
    }

    @PostMapping(value = "/todos", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TodoResponse> createTodo(Authentication auth, @RequestBody @Valid TodoCreateRequest request) {
        String userId = ((User) auth.getPrincipal()).getId();
        TodoResponse created = TodoResponse.from(service.createTodo(request.title(), request.description(), userId));
        return ResponseEntity.status(201).body(created);
    }

    @GetMapping("/todos/{id}")
    public TodoResponse getTodoById(Authentication auth, @PathVariable String id) {
        String userId = ((User) auth.getPrincipal()).getId();
        return TodoResponse.from(service.getTodoById(id, userId));
    }

    @PutMapping(value = "/todos/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public TodoResponse updateTodo(
            Authentication auth, @PathVariable String id,
            @RequestBody @Valid TodoUpdateRequest request
    ) {
        String userId = ((User) auth.getPrincipal()).getId();
        return TodoResponse
                .from(service.updateTodo(id, request.title(), request.description(), request.completed(), userId));
    }

    @DeleteMapping("/todos/{id}")
    public ResponseEntity<Void> deleteTodo(Authentication auth, @PathVariable String id) {
        String userId = ((User) auth.getPrincipal()).getId();
        service.deleteTodo(id, userId);
        return ResponseEntity.noContent().build();
    }
}
