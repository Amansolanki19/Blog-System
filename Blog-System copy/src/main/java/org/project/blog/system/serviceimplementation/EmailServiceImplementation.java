package org.project.blog.system.serviceimplementation;


import lombok.RequiredArgsConstructor;
import org.project.blog.system.service.EmailService;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImplementation implements EmailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendOtpEmail(String email, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setSubject("Password Reset OTP");
        message.setText(
                "Your password reset OTP is: " + otp
                        + "\n\n"
                        + "This OTP is valid for 5 minutes."
                        + "\n\n"
                        + "If you did not request a password reset, "
                        + "please ignore this email."
        );

        mailSender.send(message);
    }
}