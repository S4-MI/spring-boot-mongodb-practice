package com.blue.app.exception;

public class ResourceNotFound extends RuntimeException {
    public ResourceNotFound(String resourceName, String id) {
        super(String.format("%s not found with id: '%s'", resourceName, id));
    }
}
