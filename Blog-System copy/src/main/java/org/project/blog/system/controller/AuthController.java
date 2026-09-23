package org.project.blog.system.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.project.blog.system.dto.*;
import org.project.blog.system.service.PasswordResetService;
import org.project.blog.system.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final PasswordResetService passwordResetService;

    @PostMapping("/signup")
    public ResponseEntity<SignupResponseDto> signup(@Valid @RequestBody SignupRequestDto request){
        SignupResponseDto signup = userService.registerUser(request);

        return new ResponseEntity<>(signup, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto request){
        LoginResponseDto response =
                userService.loginUser(request);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequestDto request) {

        passwordResetService.sendOtp(request);

        return ResponseEntity.ok("If the email is registered, an OTP has been sent");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordRequestDto request) {

        passwordResetService.resetPassword(request);

        return ResponseEntity.ok("Password changed successfully");
    }


}
