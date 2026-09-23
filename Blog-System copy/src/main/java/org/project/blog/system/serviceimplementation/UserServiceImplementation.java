package org.project.blog.system.serviceimplementation;

import lombok.RequiredArgsConstructor;
import org.project.blog.system.config.CustomUserDetail;
import org.project.blog.system.dto.*;
import org.project.blog.system.entity.User;
import org.project.blog.system.enums.Roles;
import org.project.blog.system.exception.ResourceAlreadyExistException;
import org.project.blog.system.exception.ResourceNotFoundException;
import org.project.blog.system.exception.UnauthorizedException;
import org.project.blog.system.repository.BlogRepository;
import org.project.blog.system.repository.FollowRepository;
import org.project.blog.system.repository.UserRepository;
import org.project.blog.system.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImplementation implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final BlogRepository blogRepository;
    private final FollowRepository followRepository;
    private final CurrentUserService currentUserService;

    @Override
    public SignupResponseDto registerUser(SignupRequestDto request) {
        if(userRepository.existsByEmail(request.getEmail())){
            throw new ResourceAlreadyExistException("User Already Exists");
        }

        if (userRepository.existsByUserName(request.getUsername())){
            throw new ResourceAlreadyExistException("Username already exists");
        }


        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .userName(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .visiblePassword(request.getPassword())
                .enabled(true)
                .role(Roles.USER)
                .build();

        User savedUser = userRepository.save(user);

        return SignupResponseDto.builder()
                .id(savedUser.getId())
                .username(savedUser.getUserName())
                .email(savedUser.getEmail())
                .message("User Registered Successfully")
                .build();
    }

    @Override
    public LoginResponseDto loginUser(LoginRequestDto request) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                request.getUsername(), request.getPassword()));

        CustomUserDetail userDetails =
                (CustomUserDetail) authentication.getPrincipal();

        String token= jwtService.generateToken(userDetails);

        return LoginResponseDto.builder()
            .username(userDetails.getUsername())
                .profileImage(userDetails.getUser().getProfileImage())
            .token(token)
                .message("Login Successful")
                .token(token)
                .build();
    }

    @Override
    public List<UserSearchResponseDto> searchUsers(String username) {
        return userRepository.findByUserNameContainingIgnoreCase(username).stream()
                .map(user -> UserSearchResponseDto.builder()
                        .id(user.getId())
                        .username(user.getUserName())
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .profileImage(user.getProfileImage())
                        .bio(user.getBio())
                        .build()).toList();

    }

    @Override
    public UserProfileResponseDto getUserProfile(
            String username
    ) {

        User user =
                userRepository.findByUserName(username)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found with username: "
                                                + username
                                )
                        );

        long blogCount = blogRepository.countByUser(user);

        long followersCount = followRepository.countByFollowing(user);

        long followingCount = followRepository.countByFollower(user);

        boolean isFollowing = checkIfCurrentUserFollows(user);

        return UserProfileResponseDto.builder()
                .id(user.getId())
                .username(user.getUserName())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .bio(user.getBio())
                .profileImage(user.getProfileImage())
                .blogCount(blogCount)
                .followersCount(followersCount)
                .followingCount(followingCount)
                .isFollowing(isFollowing)
                .build();
    }

    @Override
    public UserProfileResponseDto updateProfile(UpdateProfileRequestDto request) {

        User user = currentUserService.getCurrentUser();

        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName().trim());
        }

        if (request.getLastName() != null) {
            user.setLastName(request.getLastName().trim());
        }

        if (request.getBio() != null) {
            user.setBio(request.getBio().trim());
        }

        if (request.getProfileImage() != null) {
            user.setProfileImage(request.getProfileImage().trim());
        }

        userRepository.save(user);

        return getUserProfile(
                user.getUserName()
        );
    }

    @Override
    public void changePassword(ChangePasswordRequestDto request) {

        User user = currentUserService.getCurrentUser();

        boolean matches = passwordEncoder.matches(request.getOldPassword(), user.getPassword());

        if (!matches) {
            throw new UnauthorizedException("Old password is incorrect");
        }

        if (request.getOldPassword().equals(request.getNewPassword())) {
            throw new ResourceAlreadyExistException(
                    "New password must be different from old password"
            );
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setVisiblePassword(request.getNewPassword());

        userRepository.save(user);
    }

    private boolean checkIfCurrentUserFollows(User profileUser) {

        Authentication authentication = SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return false;
        }

        String currentUsername = authentication.getName();

        User currentUser = userRepository.findByUserName(currentUsername).orElse(null);

        if (currentUser == null) {
            return false;
        }

        return followRepository
                .existsByFollowerAndFollowing(currentUser, profileUser);
    }


}
