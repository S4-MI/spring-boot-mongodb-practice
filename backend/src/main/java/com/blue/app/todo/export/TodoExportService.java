package com.blue.app.todo.export;

import com.blue.app.todo.Todo;
import com.blue.app.todo.TodoService;
import com.blue.app.todo.export.exporters.TodoExporter;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Service
public class TodoExportService {

    private final TodoService todoService;
    private final Map<TodoExportFormat, TodoExporter> exporters = new EnumMap<>(TodoExportFormat.class);

    public TodoExportService(TodoService todoService, List<TodoExporter> exporters) {
        this.todoService = todoService;

        for (TodoExporter exporter : exporters) {
            TodoExporter previous = this.exporters.put(exporter.format(), exporter);
            if (previous != null) {
                throw new IllegalStateException(
                        "Duplicate TodoExporter registered for format " + exporter.format());
            }
        }
    }

    public byte[] export(String userId, TodoExportFormat format) {
        TodoExporter exporter = exporters.get(format);
        if (exporter == null) {
            throw new IllegalArgumentException("Unsupported export format: " + format);
        }

        List<Todo> todos = todoService.listAll(userId);
        return exporter.export(todos);
    }

    public String fileName(TodoExportFormat format) {
        return "todos-" + LocalDate.now() + "." + format.extension();
    }
}
