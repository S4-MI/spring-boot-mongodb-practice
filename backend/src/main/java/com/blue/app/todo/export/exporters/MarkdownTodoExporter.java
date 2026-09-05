package com.blue.app.todo.export.exporters;

import com.blue.app.todo.Todo;
import com.blue.app.todo.export.TodoExportFormat;

import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Objects;

@Component
public class MarkdownTodoExporter implements TodoExporter {

    @Override
    public TodoExportFormat format() {
        return TodoExportFormat.MARKDOWN;
    }

    @Override
    public byte[] export(List<Todo> todos) {
        StringBuilder sb = new StringBuilder();
        sb.append("# Todos\n\n");

        if (todos.isEmpty()) {
            sb.append("_No todos._\n");
            return sb.toString().getBytes(StandardCharsets.UTF_8);
        }

        sb.append("| Status | Title | Description | Created | Updated |\n");
        sb.append("| --- | --- | --- | --- | --- |\n");

        for (Todo todo : todos) {
            sb.append("| ").append(todo.isCompleted() ? "x" : " ")
                    .append(" | ").append(cell(todo.getTitle()))
                    .append(" | ").append(cell(todo.getDescription()))
                    .append(" | ").append(cell(Objects.toString(todo.getCreatedAt(), "")))
                    .append(" | ").append(cell(Objects.toString(todo.getUpdatedAt(), "")))
                    .append(" |\n");
        }

        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    /** Keep cell content on one line and stop pipes from breaking the table. */
    private String cell(String value) {
        if (value == null || value.isEmpty()) {
            return "";
        }

        return value
                .replace("\\", "\\\\")
                .replace("|", "\\|")
                .replaceAll("\\R", "<br>");
    }
}
