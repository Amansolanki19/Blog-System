package org.project.blog.system;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.project.blog.system.dto.ForgotPasswordRequestDto;
import org.project.blog.system.entity.User;
import org.project.blog.system.repository.PasswordResetOtpRepository;
import org.project.blog.system.repository.UserRepository;
import org.project.blog.system.service.EmailService;
import org.project.blog.system.serviceimplementation.PasswordResetServiceImplementation;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Method;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PasswordResetServiceImplementationTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordResetOtpRepository otpRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private PasswordResetServiceImplementation passwordResetService;

    @Test
    void shouldNotThrowWhenSendingOtpEmailFails() {
        ForgotPasswordRequestDto request = new ForgotPasswordRequestDto();
        request.setEmail("demo@example.com");

        User user = new User();
        user.setEmail("demo@example.com");

        when(userRepository.findByEmail("demo@example.com")).thenReturn(Optional.of(user));
        doThrow(new MailAuthenticationException("Invalid SMTP credentials"))
                .when(emailService).sendOtpEmail(anyString(), anyString());

        assertDoesNotThrow(() -> passwordResetService.sendOtp(request));
    }

    @Test
    void shouldUseTransactionForOtpLifecycle() throws NoSuchMethodException {
        Method sendOtpMethod = PasswordResetServiceImplementation.class.getDeclaredMethod("sendOtp", ForgotPasswordRequestDto.class);
        Method resetPasswordMethod = PasswordResetServiceImplementation.class.getDeclaredMethod("resetPassword", org.project.blog.system.dto.ResetPasswordRequestDto.class);

        assertNotNull(sendOtpMethod.getAnnotation(Transactional.class));
        assertNotNull(resetPasswordMethod.getAnnotation(Transactional.class));
    }
}
