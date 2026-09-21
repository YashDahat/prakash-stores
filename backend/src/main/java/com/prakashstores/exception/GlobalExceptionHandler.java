package com.prakashstores.exception;

import com.prakashstores.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import com.prakashstores.exception.ResourceNotFoundException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.NOT_FOUND.value())
                .error(HttpStatus.NOT_FOUND.getReasonPhrase())
                .message(ex.getMessage())
                .path(request.getDescription(false).replace("uri=", ""))
                .build();
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException ex, WebRequest request) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .message(ex.getMessage())
                .path(request.getDescription(false).replace("uri=", ""))
                .build();
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    // A controller (e.g. signup's duplicate email/phone) can raise ResponseStatusException to pick an
    // exact status like 409 CONFLICT. Without this, the broad Exception handler below would swallow it
    // and rewrite it to 500, hiding the real reason from the client.
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorResponse> handleResponseStatusException(ResponseStatusException ex, WebRequest request) {
        HttpStatus status = HttpStatus.valueOf(ex.getStatusCode().value());
        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(status.value())
                .error(status.getReasonPhrase())
                .message(ex.getReason())
                .path(request.getDescription(false).replace("uri=", ""))
                .build();
        return new ResponseEntity<>(errorResponse, status);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex, WebRequest request) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase())
                .message("An unexpected error occurred: " + ex.getMessage())
                .path(request.getDescription(false).replace("uri=", ""))
                .build();
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @org.springframework.web.bind.annotation.ExceptionHandler(org.springframework.security.core.AuthenticationException.class)
    public org.springframework.http.ResponseEntity<String> handleAuthenticationException(
            org.springframework.security.core.AuthenticationException ex) {
        return org.springframework.http.ResponseEntity
                .status(org.springframework.http.HttpStatus.UNAUTHORIZED)
                .body(ex.getMessage());
    }
}