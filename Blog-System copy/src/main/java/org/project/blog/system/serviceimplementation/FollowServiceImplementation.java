package org.project.blog.system.serviceimplementation;

import lombok.RequiredArgsConstructor;
import org.project.blog.system.dto.FollowUserResponseDto;
import org.project.blog.system.entity.Follow;
import org.project.blog.system.entity.User;
import org.project.blog.system.exception.ResourceAlreadyExistException;
import org.project.blog.system.exception.ResourceNotFoundException;
import org.project.blog.system.exception.UnauthorizedException;
import org.project.blog.system.repository.FollowRepository;
import org.project.blog.system.repository.UserRepository;
import org.project.blog.system.service.FollowService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FollowServiceImplementation implements FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;

    @Override
    public void followUser(String username) {
        User follower = currentUserService.getCurrentUser();

        User following = userRepository.findByUserName(username)
                .orElseThrow(()-> new ResourceNotFoundException("User not found with username: "+username));

        if (follower.getId().equals(following.getId())){
            throw new UnauthorizedException("You cannot follow yourself");
        }

        if (followRepository.existsByFollowerAndFollowing(follower,following)){
            throw new ResourceAlreadyExistException("You are already following this user");
        }

        Follow follow = Follow.builder()
                .follower(follower)
                .following(following)
                .build();

        followRepository.save(follow);
    }

    @Override
    @Transactional
    public void unfollowUser(String username) {
        User follower = currentUserService.getCurrentUser();

        User following = userRepository.findByUserName(username)
                .orElseThrow(()-> new ResourceNotFoundException("User not found with username: "+username));

        Follow follow = followRepository.findByFollowerAndFollowing(follower, following)
            .orElseThrow(() -> new ResourceNotFoundException("You are not following this user"));

        followRepository.delete(follow);
    }

    @Override
    public List<FollowUserResponseDto> getFollower(String username) {
        User user = userRepository.findByUserName(username).orElseThrow(null);

        return followRepository.findByFollowing(user)
                .stream()
                .map(follow ->
                mapToResponse(follow.getFollower())
                ).toList();
    }

    @Override
    public List<FollowUserResponseDto> getFollowing(String username) {
        User user = userRepository.findByUserName(username).orElseThrow(null);

        return followRepository
                .findByFollower(user)
                .stream()
                .map(follow -> mapToResponse(follow.getFollowing()))
                .toList();
    }

    private FollowUserResponseDto mapToResponse(User user){
        return FollowUserResponseDto.builder()
                .id(user.getId())
                .username(user.getUserName())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .profileImage(user.getProfileImage())
                .build();
    }
}
