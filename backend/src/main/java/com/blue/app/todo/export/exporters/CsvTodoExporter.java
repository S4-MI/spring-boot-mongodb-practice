package com.blue.app.todo.export.exporters;

import com.blue.app.todo.Todo;
import com.blue.app.todo.export.TodoExportFormat;

import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Objects;

@Component
public class CsvTodoExporter implements TodoExporter {

    private static final String HEADER = "id,title,description,completed,createdAt,updatedAt";

    @Override
    public TodoExportFormat format() {
        return TodoExportFormat.CSV;
    }

    @Override
    public byte[] export(List<Todo> todos) {
        StringBuilder sb = new StringBuilder();
        sb.append(HEADER).append("\r\n");

        for (Todo todo : todos) {
            sb.append(quote(todo.getId())).append(',')
                    .append(quote(todo.getTitle())).append(',')
                    .append(quote(todo.getDescription())).append(',')
                    .append(todo.isCompleted()).append(',')
                    .append(quote(Objects.toString(todo.getCreatedAt(), ""))).append(',')
                    .append(quote(Objects.toString(todo.getUpdatedAt(), "")))
                    .append("\r\n");
        }

        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    /** RFC 4180: wrap in quotes when needed, doubling any embedded quote. */
    private String quote(String value) {
        if (value == null || value.isEmpty()) {
            return "";
        }

        String escaped = value.replace("\"", "\"\"");
        boolean needsQuoting = value.indexOf(',') >= 0
                || value.indexOf('"') >= 0
                || value.indexOf('\n') >= 0
                || value.indexOf('\r') >= 0;

        return needsQuoting ? '"' + escaped + '"' : escaped;
    }
}
