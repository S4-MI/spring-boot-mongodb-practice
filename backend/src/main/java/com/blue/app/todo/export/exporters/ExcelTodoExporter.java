package com.blue.app.todo.export.exporters;

import com.blue.app.todo.Todo;
import com.blue.app.todo.export.TodoExportFormat;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class ExcelTodoExporter implements TodoExporter {

    private static final String[] HEADERS = {
            "ID", "Title", "Description", "Completed", "Created At", "Updated At"
    };

    /** Column widths in characters, applied before rows are flushed to disk. */
    private static final int[] COLUMN_WIDTHS = { 26, 40, 60, 12, 21, 21 };

    private static final String DATE_FORMAT = "yyyy-mm-dd hh:mm:ss";

    /** Rows kept in memory by SXSSF; older rows are flushed to a temp file. */
    private static final int ROW_ACCESS_WINDOW = 200;

    @Override
    public TodoExportFormat format() {
        return TodoExportFormat.EXCEL;
    }

    @Override
    public byte[] export(List<Todo> todos) {
        try (SXSSFWorkbook workbook = new SXSSFWorkbook(ROW_ACCESS_WINDOW);
                ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            // Temp files hold flushed rows; compress them so large exports stay small on disk.
            workbook.setCompressTempFiles(true);

            try {
                Sheet sheet = workbook.createSheet("Todos");
                CellStyle headerStyle = headerStyle(workbook);
                CellStyle dateStyle = dateStyle(workbook);

                // SXSSF cannot autosize (flushed rows are gone), so widths are set up front.
                for (int i = 0; i < COLUMN_WIDTHS.length; i++) {
                    sheet.setColumnWidth(i, COLUMN_WIDTHS[i] * 256);
                }

                writeHeader(sheet, headerStyle);
                writeRows(sheet, todos, dateStyle);

                sheet.createFreezePane(0, 1);
                sheet.setAutoFilter(new CellRangeAddress(0, Math.max(todos.size(), 1), 0, HEADERS.length - 1));

                workbook.write(out);
            } finally {
                // Always remove the backing temp files, even if writing failed.
                workbook.close();
            }

            return out.toByteArray();
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to write todo Excel export", e);
        }
    }

    private void writeHeader(Sheet sheet, CellStyle style) {
        Row header = sheet.createRow(0);

        for (int i = 0; i < HEADERS.length; i++) {
            Cell cell = header.createCell(i);
            cell.setCellValue(HEADERS[i]);
            cell.setCellStyle(style);
        }
    }

    private void writeRows(Sheet sheet, List<Todo> todos, CellStyle dateStyle) {
        int rowIndex = 1;

        for (Todo todo : todos) {
            Row row = sheet.createRow(rowIndex++);

            row.createCell(0).setCellValue(nullSafe(todo.getId()));
            row.createCell(1).setCellValue(nullSafe(todo.getTitle()));
            row.createCell(2).setCellValue(nullSafe(todo.getDescription()));
            row.createCell(3).setCellValue(todo.isCompleted());

            dateCell(row, 4, todo.getCreatedAt(), dateStyle);
            dateCell(row, 5, todo.getUpdatedAt(), dateStyle);
        }
    }

    /** Write a real date cell so Excel can sort and filter it, not a string. */
    private void dateCell(Row row, int column, LocalDateTime value, CellStyle style) {
        Cell cell = row.createCell(column);
        cell.setCellStyle(style);

        if (value != null) {
            cell.setCellValue(value);
        }
    }

    private CellStyle headerStyle(Workbook workbook) {
        Font font = workbook.createFont();
        font.setBold(true);

        CellStyle style = workbook.createCellStyle();
        style.setFont(font);
        return style;
    }

    private CellStyle dateStyle(Workbook workbook) {
        CreationHelper helper = workbook.getCreationHelper();
        CellStyle style = workbook.createCellStyle();
        style.setDataFormat(helper.createDataFormat().getFormat(DATE_FORMAT));
        return style;
    }

    private String nullSafe(String value) {
        return value == null ? "" : value;
    }
}
