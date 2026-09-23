package org.project.blog.system.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.project.blog.system.dto.ChangePasswordRequestDto;
import org.project.blog.system.dto.UpdateProfileRequestDto;
import org.project.blog.system.dto.UserProfileResponseDto;
import org.project.blog.system.dto.UserSearchResponseDto;
import org.project.blog.system.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/search")
    public ResponseEntity<List<UserSearchResponseDto>> searchUsers(@RequestParam String username){
        return ResponseEntity.ok(userService.searchUsers(username));
    }

    @GetMapping("/{username}")
    public ResponseEntity<UserProfileResponseDto> getUserProfile(@PathVariable String username){
        return ResponseEntity.ok(userService.getUserProfile(username));
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileResponseDto> updateProfile(@Valid @RequestBody UpdateProfileRequestDto request){
        return ResponseEntity.ok(userService.updateProfile(request));
    }

    @PutMapping("/me/password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordRequestDto request) {

        userService.changePassword(request);

        return ResponseEntity.noContent().build();
    }
}
