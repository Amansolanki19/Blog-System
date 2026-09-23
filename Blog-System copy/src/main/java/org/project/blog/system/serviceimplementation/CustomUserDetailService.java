package org.project.blog.system.serviceimplementation;

import lombok.RequiredArgsConstructor;
import org.project.blog.system.config.CustomUserDetail;
import org.project.blog.system.entity.User;
import org.project.blog.system.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        User user = userRepository.findByUserName(login)
                .or(() -> userRepository.findByEmail(login))
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username or email: " + login));

        return new CustomUserDetail(user);
    }
}
