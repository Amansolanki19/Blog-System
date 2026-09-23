package org.project.blog.system;

import org.junit.jupiter.api.Test;
import org.project.blog.system.serviceimplementation.JwtService;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class JwtServiceTest {

    @Test
    void shouldGenerateTokenWithPlainTextSecret() {
        JwtService jwtService = new JwtService(
                "gsfngvdosfdarfheigfdgpfgh94835u329041-39hrenfdertrigvu9uqhw8ehcrrghbvhfc9qhuxfvibhbBIBIBD8ER49R53421",
                86400000L
        );

        UserDetails user = User.withUsername("demo")
                .password("secret")
                .authorities("ROLE_USER")
                .build();

        String token = jwtService.generateToken(user);

        assertNotNull(token);
        assertEquals("demo", jwtService.extractUsername(token));
    }
}
