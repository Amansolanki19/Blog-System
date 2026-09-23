package org.project.blog.system.controller;

import lombok.RequiredArgsConstructor;
import org.project.blog.system.dto.FollowUserResponseDto;
import org.project.blog.system.service.FollowService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class FollowerController {
    private final FollowService followService;

    @PostMapping("/{username}/follow")
    public ResponseEntity<Void> followUser(@PathVariable String username){
        followService.followUser(username);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{username}/follow")
    public ResponseEntity<Void> unfollowUser(@PathVariable String username){
        followService.unfollowUser(username);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/profile/{username}/followers")
    public ResponseEntity<List<FollowUserResponseDto>> getFollower(@PathVariable String username){
        return ResponseEntity.ok(followService.getFollower(username));
    }

    @GetMapping("/profile/{username}/following")
    public ResponseEntity<List<FollowUserResponseDto>> getFollowing(@PathVariable String username){
        return ResponseEntity.ok(followService.getFollowing(username));
    }

}
