package org.project.blog.system.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LikeUserResponseDto {
    private Long id;
    private String username;
    private String firstName;
    private String lastName;
    private String profileImage;
}
