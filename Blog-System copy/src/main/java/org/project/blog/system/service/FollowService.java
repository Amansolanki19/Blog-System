package org.project.blog.system.service;

import org.project.blog.system.dto.FollowUserResponseDto;

import java.util.List;

public interface FollowService {
    void followUser(String username);
    void unfollowUser(String username);
    List<FollowUserResponseDto> getFollower(String username);
    List<FollowUserResponseDto> getFollowing(String username);
}
