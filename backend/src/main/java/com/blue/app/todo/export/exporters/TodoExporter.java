package com.blue.app.todo.export.exporters;

import com.blue.app.todo.Todo;
import com.blue.app.todo.export.TodoExportFormat;

import java.util.List;

/**
 * One implementation per supported export format. Add a new {@code @Component}
 * implementing this interface and it is picked up automatically by
 * {@link TodoExportService}.
 */
public interface TodoExporter {

    TodoExportFormat format();

    byte[] export(List<Todo> todos);
}
