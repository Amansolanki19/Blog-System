package org.project.blog.system;

import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.Test;
import org.project.blog.system.exception.GlobalExceptionHandler;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.BadCredentialsException;

import static org.junit.jupiter.api.Assertions.assertEquals;

class GlobalExceptionHandlerTest {

    @Test
    void shouldReturnUnauthorizedForBadCredentials() {
        GlobalExceptionHandler handler = new GlobalExceptionHandler();
        HttpServletRequest request = new MockHttpServletRequest("POST", "/api/auth/login");

        var response = handler.handleBadCredentials(new BadCredentialsException("Bad credentials"), request);

        assertEquals(HttpStatus.UNAUTHORIZED.value(), Integer.parseInt(response.getBody().getStatus()));
    }

    @Test
    void shouldReturnUnauthorizedWhenAuthenticationIsMissing() {
        GlobalExceptionHandler handler = new GlobalExceptionHandler();
        HttpServletRequest request = new MockHttpServletRequest("PUT", "/api/user/me");

        var response = handler.handleAuthenticationCredentialsNotFound(
                new AuthenticationCredentialsNotFoundException("Authentication is required"),
                request
        );

        assertEquals(HttpStatus.UNAUTHORIZED.value(), Integer.parseInt(response.getBody().getStatus()));
    }
}
