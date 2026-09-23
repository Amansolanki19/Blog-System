package org.project.blog.system.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequestDto {

    @NotBlank(message = "Username or email cannot be blank")
    private String username;

    @NotBlank(message = "Password cannot be blank")
    private String password;
}
