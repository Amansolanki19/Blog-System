package org.project.blog.system.service;

import org.project.blog.system.dto.*;

import java.util.List;

public interface UserService {
    SignupResponseDto registerUser(SignupRequestDto request);

    LoginResponseDto loginUser(LoginRequestDto request);

    List<UserSearchResponseDto> searchUsers(String username);

    UserProfileResponseDto getUserProfile(String username);

    UserProfileResponseDto updateProfile(UpdateProfileRequestDto request);

    void changePassword(ChangePasswordRequestDto request);

}
