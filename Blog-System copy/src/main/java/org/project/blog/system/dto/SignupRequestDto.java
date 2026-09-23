package org.project.blog.system.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignupRequestDto {
    @NotBlank(message = "First name cannot be blank")
    @Size(min = 2,max = 20, message = "First name size must be between 2 to 20 words")
    private String firstName;


    private String lastName;

    @NotBlank(message = "Username cannot be blank")
    @Size(min = 3,max = 20, message = "First name size must be between 3 to 20 words")
    private String username;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Invalid email")
    private String email;

    @Pattern(
            regexp =
                    "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=!]).{8,20}$",
            message =
                    "Password must contain uppercase, lowercase, number and special character"
    )
    private String password;
}
