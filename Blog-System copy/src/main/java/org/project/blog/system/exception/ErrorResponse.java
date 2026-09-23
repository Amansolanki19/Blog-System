package org.project.blog.system.exception;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ErrorResponse extends RuntimeException {
    private LocalDateTime timeStamp;
    private String status;
    private String error;
    private String message;
    private String path;
}
