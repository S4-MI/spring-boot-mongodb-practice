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

    /** Excel reads a CSV as the system ANSI codepage unless a UTF-8 BOM tells it otherwise. */
    private static final byte[] UTF8_BOM = { (byte) 0xEF, (byte) 0xBB, (byte) 0xBF };

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

        byte[] csv = sb.toString().getBytes(StandardCharsets.UTF_8);
        byte[] out = new byte[UTF8_BOM.length + csv.length];
        System.arraycopy(UTF8_BOM, 0, out, 0, UTF8_BOM.length);
        System.arraycopy(csv, 0, out, UTF8_BOM.length, csv.length);

        return out;
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
