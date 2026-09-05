package com.blue.app.todo.export.exporters;

import com.blue.app.todo.Todo;
import com.blue.app.todo.dto.TodoResponse;
import com.blue.app.todo.export.TodoExportFormat;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

@Component
@AllArgsConstructor
public class JsonTodoExporter implements TodoExporter {

    private final ObjectMapper objectMapper;

    @Override
    public TodoExportFormat format() {
        return TodoExportFormat.JSON;
    }

    @Override
    public byte[] export(List<Todo> todos) {
        List<TodoResponse> payload = todos.stream().map(TodoResponse::from).toList();

        try {
            return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsBytes(payload);
        } catch (JacksonException e) {
            throw new IllegalStateException("Failed to serialize todos as JSON", e);
        }
    }
}
