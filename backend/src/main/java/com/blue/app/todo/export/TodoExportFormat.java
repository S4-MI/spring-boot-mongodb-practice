package com.blue.app.todo.export;

public enum TodoExportFormat {
    CSV("csv", "text/csv"),
    MARKDOWN("md", "text/markdown"),
    JSON("json", "application/json");

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
