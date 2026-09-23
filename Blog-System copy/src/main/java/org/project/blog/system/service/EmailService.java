package org.project.blog.system.service;

public interface EmailService {

    void sendOtpEmail(String email, String otp);
}