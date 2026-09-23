package org.project.blog.system.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class BlogResponseDto {

    private Long id;
    private String title;
    private String content;
    private String username;
    private String profileImage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private long likeCount;
    private long commentCount;
    private boolean likedByCurrentUser;

}