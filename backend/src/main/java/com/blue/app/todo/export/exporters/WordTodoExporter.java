package com.blue.app.todo.export.exporters;

import com.blue.app.todo.Todo;
import com.blue.app.todo.export.TodoExportFormat;

import org.apache.poi.xwpf.usermodel.ParagraphAlignment;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.apache.poi.xwpf.usermodel.XWPFTable;
import org.apache.poi.xwpf.usermodel.XWPFTableCell;
import org.apache.poi.xwpf.usermodel.XWPFTableRow;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
public class WordTodoExporter implements TodoExporter {

    private static final String[] HEADERS = {
            "Status", "Title", "Description", "Created At", "Updated At"
    };

    /** Table column widths in twentieths of a point; must total the usable page width. */
    private static final int[] COLUMN_WIDTHS = { 1000, 2200, 3400, 1500, 1500 };

    private static final String HEADER_FILL = "D9D9D9";

    private static final DateTimeFormatter DATE_FORMAT =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Override
    public TodoExportFormat format() {
        return TodoExportFormat.WORD;
    }

    @Override
    public byte[] export(List<Todo> todos) {
        try (XWPFDocument document = new XWPFDocument();
                ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            writeTitle(document, todos.size());

            if (todos.isEmpty()) {
                XWPFRun run = document.createParagraph().createRun();
                run.setItalic(true);
                run.setText("No todos.");
            } else {
                writeTable(document, todos);
            }

            document.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to write todo Word export", e);
        }
    }

    private void writeTitle(XWPFDocument document, int count) {
        XWPFParagraph title = document.createParagraph();
        title.setAlignment(ParagraphAlignment.LEFT);

        XWPFRun titleRun = title.createRun();
        titleRun.setText("Todos");
        titleRun.setBold(true);
        titleRun.setFontSize(18);

        XWPFParagraph subtitle = document.createParagraph();
        XWPFRun subtitleRun = subtitle.createRun();
        subtitleRun.setText("Exported " + LocalDateTime.now().format(DATE_FORMAT)
                + " — " + count + (count == 1 ? " item" : " items"));
        subtitleRun.setItalic(true);
        subtitleRun.setFontSize(9);
    }

    private void writeTable(XWPFDocument document, List<Todo> todos) {
        // XWPFDocument seeds a new table with one row and one cell; reuse it as the header.
        XWPFTable table = document.createTable(todos.size() + 1, HEADERS.length);
        table.setWidth("100%");

        XWPFTableRow header = table.getRow(0);
        for (int i = 0; i < HEADERS.length; i++) {
            XWPFTableCell cell = header.getCell(i);
            cell.setColor(HEADER_FILL);
            cell.setWidth(String.valueOf(COLUMN_WIDTHS[i]));
            styledText(cell, HEADERS[i], true);
        }

        int rowIndex = 1;
        for (Todo todo : todos) {
            XWPFTableRow row = table.getRow(rowIndex++);

            styledText(row.getCell(0), todo.isCompleted() ? "Done" : "Open", false);
            styledText(row.getCell(1), nullSafe(todo.getTitle()), false);
            styledText(row.getCell(2), nullSafe(todo.getDescription()), false);
            styledText(row.getCell(3), formatDate(todo.getCreatedAt()), false);
            styledText(row.getCell(4), formatDate(todo.getUpdatedAt()), false);

            for (int i = 0; i < HEADERS.length; i++) {
                row.getCell(i).setWidth(String.valueOf(COLUMN_WIDTHS[i]));
            }
        }
    }

    /**
     * Replace the empty paragraph POI puts in every new cell, so the text carries
     * our formatting instead of appending a second paragraph below a blank line.
     */
    private void styledText(XWPFTableCell cell, String text, boolean bold) {
        XWPFParagraph paragraph = cell.getParagraphs().get(0);
        XWPFRun run = paragraph.createRun();
        run.setBold(bold);
        run.setFontSize(10);

        // Keep multi-line descriptions readable instead of collapsing them together.
        String[] lines = text.split("\\R", -1);
        for (int i = 0; i < lines.length; i++) {
            if (i > 0) {
                run.addBreak();
            }
            run.setText(lines[i], i);
        }
    }

    private String formatDate(LocalDateTime value) {
        return value == null ? "" : value.format(DATE_FORMAT);
    }

    private String nullSafe(String value) {
        return value == null ? "" : value;
    }
}
