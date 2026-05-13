package com.blue.app.exception;

public class EmailAlreadyInUseException extends RuntimeException {
    private final String email;

    public EmailAlreadyInUseException(String email) {
        super("Invalid credentials");
        this.email = email;
    }

    public String getEmail() {
        return email;
    }
}
