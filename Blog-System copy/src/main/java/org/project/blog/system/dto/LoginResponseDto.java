package org.project.blog.system.dto;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponseDto {

    private String username;
    private String profileImage;
    private String token;
    private String message;
}
