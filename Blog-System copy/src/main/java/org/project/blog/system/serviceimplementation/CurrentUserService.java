package org.project.blog.system.serviceimplementation;

import lombok.RequiredArgsConstructor;
import org.project.blog.system.entity.User;
import org.project.blog.system.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CurrentUserService {
    private final UserRepository userRepository;

    public User getCurrentUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()
                || authentication.getPrincipal() == null
                || "anonymousUser".equals(authentication.getPrincipal().toString())) {
            throw new AuthenticationCredentialsNotFoundException("Authentication is required");
        }

        String username = authentication.getName();

        return userRepository.findByUserName(username)
                .orElseThrow(() -> new UsernameNotFoundException("Authenticated user not found"));
    }
}
