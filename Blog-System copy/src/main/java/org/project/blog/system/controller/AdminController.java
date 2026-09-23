package org.project.blog.system.controller;

import lombok.RequiredArgsConstructor;
import org.project.blog.system.dto.BlogResponseDto;
import org.project.blog.system.dto.UserSearchResponseDto;
import org.project.blog.system.entity.Blogs;
import org.project.blog.system.entity.User;
import org.project.blog.system.exception.ResourceNotFoundException;
import org.project.blog.system.repository.BlogRepository;
import org.project.blog.system.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final BlogRepository blogRepository;

    @GetMapping("/users")
    public ResponseEntity<List<UserSearchResponseDto>> getAllUsers() {
        List<UserSearchResponseDto> users = userRepository.findAll()
                        .stream()
                        .map(user ->
                                UserSearchResponseDto.builder()
                                        .id(user.getId())
                                        .username(user.getUserName())
                                        .firstName(user.getFirstName())
                                        .lastName(user.getLastName())
                                        .profileImage(
                                                user.getProfileImage()
                                        )
                                        .build()
                        )
                        .toList();

        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserSearchResponseDto> getUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        return ResponseEntity.ok(UserSearchResponseDto.builder()
                        .id(user.getId())
                        .username(user.getUserName())
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .profileImage(user.getProfileImage())
                        .build()
        );
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {

        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        userRepository.delete(user);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/blogs")
    public ResponseEntity<List<BlogResponseDto>>
    getAllBlogs() {

        List<BlogResponseDto> blogs = blogRepository.findAll()
                        .stream()
                        .map(blog -> BlogResponseDto.builder()
                                        .id(blog.getId())
                                        .title(blog.getTitle())
                                        .content(blog.getContent())
                                        .username(blog.getUser().getUserName())
                                        .createdAt(blog.getCreatedAt())
                                        .updatedAt(blog.getUpdatedAt())
                                        .build()
                        )
                        .toList();

        return ResponseEntity.ok(blogs);
    }

    @DeleteMapping("/blogs/{id}")
    public ResponseEntity<Void> deleteBlog( @PathVariable Long id) {

        Blogs blog = blogRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Blog not found with id: " + id));

        blogRepository.delete(blog);

        return ResponseEntity.noContent().build();
    }
}
