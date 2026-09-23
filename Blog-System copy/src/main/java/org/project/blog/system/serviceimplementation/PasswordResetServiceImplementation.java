package org.project.blog.system.serviceimplementation;



import lombok.RequiredArgsConstructor;
import org.project.blog.system.dto.ForgotPasswordRequestDto;
import org.project.blog.system.dto.ResetPasswordRequestDto;
import org.project.blog.system.entity.PasswordResetOtp;
import org.project.blog.system.entity.User;
import org.project.blog.system.exception.ResourceNotFoundException;
import org.project.blog.system.exception.UnauthorizedException;
import org.project.blog.system.repository.PasswordResetOtpRepository;
import org.project.blog.system.repository.UserRepository;
import org.project.blog.system.service.EmailService;
import org.project.blog.system.service.PasswordResetService;
import org.springframework.mail.MailException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class PasswordResetServiceImplementation implements PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetOtpRepository otpRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void sendOtp(ForgotPasswordRequestDto request) {

        String email = request.getEmail().trim().toLowerCase();

        userRepository.findByEmail(email).ifPresent(user -> {


            otpRepository.invalidatePreviousOtps(email);


            String otp = String.format("%06d", new Random().nextInt(1_000_000));


            LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(5);

            PasswordResetOtp passwordResetOtp = PasswordResetOtp.builder()
                            .email(email)
                            .otp(otp)
                            .expiresAt(expiresAt)
                            .used(false)
                            .build();

            otpRepository.save(passwordResetOtp);

            try {
                emailService.sendOtpEmail(email, otp);
            } catch (MailException ignored) {
               
            }
        });
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequestDto request) {
        String email = request.getEmail().trim().toLowerCase();

        String otp = request.getOtp().trim();

        PasswordResetOtp resetOtp =
                otpRepository.findTopByEmailOrderByCreatedAtDesc(email)
                        .orElseThrow(() -> new UnauthorizedException("Invalid or expired OTP"));

        if (resetOtp.isUsed()) {
            throw new UnauthorizedException("Invalid or expired OTP");
        }


        if (!resetOtp.getOtp().equals(otp)) {
            throw new UnauthorizedException("Invalid or expired OTP");
        }


        if (resetOtp.getExpiresAt().isBefore(LocalDateTime.now())) {

            throw new UnauthorizedException("Invalid or expired OTP");
        }


        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));


        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);

        resetOtp.setUsed(true);
        otpRepository.save(resetOtp);
    }
}