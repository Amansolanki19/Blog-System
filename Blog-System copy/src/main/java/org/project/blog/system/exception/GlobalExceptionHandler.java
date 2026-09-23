package org.project.blog.system.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler extends RuntimeException {
    @ExceptionHandler(ResourceAlreadyExistException.class)
    public ResponseEntity<ErrorResponse> handleAlreadyExists(ResourceAlreadyExistException exception,
                                                             HttpServletRequest request){
        ErrorResponse response = ErrorResponse.builder()
                .timeStamp(LocalDateTime.now())
                .status(String.valueOf(HttpStatus.CONFLICT.value()))
                .error("Conflict")
                .message(exception.getMessage())
                .path(request.getRequestURI())
                .build();

        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(response);

    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException exception,
                                                                HttpServletRequest request){
        ErrorResponse response = ErrorResponse.builder()
                .timeStamp(LocalDateTime.now())
                .status(String.valueOf(HttpStatus.NOT_FOUND.value()))
                .error("Not Found")
                .message(exception.getMessage())
                .path(request.getRequestURI())
                .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            MethodArgumentNotValidException ex,
            HttpServletRequest request
    ) {

        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        errors.put(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );

        ErrorResponse response = ErrorResponse.builder()
                .timeStamp(LocalDateTime.now())
                .status(String.valueOf(HttpStatus.BAD_REQUEST.value()))
                .error("Validation Error")
                .message(errors.toString())
                .path(request.getRequestURI())
                .build();

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorized(
            UnauthorizedException ex,
            HttpServletRequest request
    ) {

        ErrorResponse response =
                ErrorResponse.builder()
                        .timeStamp(LocalDateTime.now())
                        .status(String.valueOf(HttpStatus.FORBIDDEN.value()))
                        .error("Forbidden")
                        .message(ex.getMessage())
                        .path(request.getRequestURI())
                        .build();

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(response);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException ex, HttpServletRequest request) {
        ErrorResponse error = ErrorResponse.builder()
                .timeStamp(LocalDateTime.now())
                .status(String.valueOf(HttpStatus.UNAUTHORIZED.value()))
                .error("Unauthorized")
                .message("Invalid username or password")
                .path(request.getRequestURI())
                .build();

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @ExceptionHandler(AuthenticationCredentialsNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleAuthenticationCredentialsNotFound(
            AuthenticationCredentialsNotFoundException ex,
            HttpServletRequest request
    ) {
        ErrorResponse error = ErrorResponse.builder()
                .timeStamp(LocalDateTime.now())
                .status(String.valueOf(HttpStatus.UNAUTHORIZED.value()))
                .error("Unauthorized")
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .build();

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthenticationException(AuthenticationException ex, HttpServletRequest request) {

        ErrorResponse error = ErrorResponse.builder()
                        .timeStamp(LocalDateTime.now())
                        .status(String.valueOf(HttpStatus.UNAUTHORIZED.value()))
                        .error("Unauthorized")
                        .message("Invalid username or password")
                        .path(request.getRequestURI())
                        .build();

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUsernameNotFound(UsernameNotFoundException ex, HttpServletRequest request) {
        ErrorResponse error = ErrorResponse.builder()
                .timeStamp(LocalDateTime.now())
                .status(String.valueOf(HttpStatus.NOT_FOUND.value()))
                .error("Not Found")
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex, HttpServletRequest request) {

        ErrorResponse error = ErrorResponse.builder()
                        .timeStamp(LocalDateTime.now())
                        .status(String.valueOf(HttpStatus.INTERNAL_SERVER_ERROR.value()))
                        .error("Internal Server Error")
                        .message("An unexpected error occurred")
                        .path(request.getRequestURI())
                        .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
