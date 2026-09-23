package org.project.blog.system.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ResetPasswordRequestDto {

    @NotBlank(message = "Email cannot be blank")
    private String email;

    @NotBlank(message = "OTP cannot be blank")
    @Pattern(
            regexp = "^\\d{6}$",
            message = "OTP must contain exactly 6 digits"
    )
    private String otp;

    @NotBlank(message = "New password cannot be blank")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=!]).{8,20}$",
            message = "Password must contain uppercase, lowercase, number and special character"
    )
    private String newPassword;
}
