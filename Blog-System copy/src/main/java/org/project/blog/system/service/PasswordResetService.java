package org.project.blog.system.service;


import org.project.blog.system.dto.ForgotPasswordRequestDto;
import org.project.blog.system.dto.ResetPasswordRequestDto;

public interface PasswordResetService {

    void sendOtp(ForgotPasswordRequestDto request);

    void resetPassword(ResetPasswordRequestDto request);
}
