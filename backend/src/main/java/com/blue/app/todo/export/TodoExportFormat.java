package com.blue.app.todo.export;

public enum TodoExportFormat {
    CSV("csv", "text/csv;charset=UTF-8"),
    MARKDOWN("md", "text/markdown;charset=UTF-8"),
    JSON("json", "application/json"),
    EXCEL("xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"),
    WORD("docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

    private final String extension;
    private final String contentType;

    TodoExportFormat(String extension, String contentType) {
        this.extension = extension;
        this.contentType = contentType;
    }

    public String extension() {
        return extension;
    }

    public String contentType() {
        return contentType;
    }
}
