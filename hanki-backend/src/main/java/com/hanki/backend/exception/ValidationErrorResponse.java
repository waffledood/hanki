package com.hanki.backend.exception;

import java.time.Instant;
import java.util.Map;

public class ValidationErrorResponse {

    private Instant timestamp;
    private int status;
    private Map<String, String> errors;

    public ValidationErrorResponse(int status, Map<String, String> errors) {
        this.timestamp = Instant.now();
        this.status = status;
        this.errors = errors;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public int getStatus() {
        return status;
    }

    public Map<String, String> getErrors() {
        return errors;
    }
}
