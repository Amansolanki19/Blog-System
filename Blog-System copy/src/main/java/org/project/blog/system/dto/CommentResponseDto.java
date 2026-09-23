package org.project.blog.system.dto;



import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CommentResponseDto {

    private Long id;
    private String content;
    private String username;
    private String firstName;
    private String lastName;
    private String profileImage;
    private Long blogId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
