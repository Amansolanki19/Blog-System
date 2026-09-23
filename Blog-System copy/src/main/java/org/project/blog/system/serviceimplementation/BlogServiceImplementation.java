package org.project.blog.system.serviceimplementation;




import lombok.RequiredArgsConstructor;
import org.project.blog.system.dto.BlogRequestDto;
import org.project.blog.system.dto.BlogResponseDto;
import org.project.blog.system.entity.Blogs;
import org.project.blog.system.entity.User;
import org.project.blog.system.exception.ResourceNotFoundException;
import org.project.blog.system.exception.UnauthorizedException;
import org.project.blog.system.repository.*;
import org.project.blog.system.service.BlogService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BlogServiceImplementation implements BlogService {

    private final BlogRepository blogRepository;
    private final LikeRepository likeRepository;
    private final CurrentUserService currentUserService;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;

    @Override
    public BlogResponseDto createBlog(
            BlogRequestDto request
    ) {

        User currentUser =
                currentUserService.getCurrentUser();

        Blogs blog = Blogs.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .user(currentUser)
                .build();

        Blogs savedBlog =
                blogRepository.save(blog);

        return mapToResponse(savedBlog);
    }

    @Override
    public List<BlogResponseDto> getAllBlogs() {

        return blogRepository.findAllBlogSummaries()
                .stream()
                .map(this::mapProjectionToResponse)
                .toList();
    }

    @Override
    public BlogResponseDto getBlogById(Long id) {

        Blogs blog =
                blogRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Blog not found with id: " + id
                                )
                        );

        return mapToResponse(blog);
    }

    @Override
    public List<BlogResponseDto> getMyBlogs() {

        User currentUser =
                currentUserService.getCurrentUser();

        return blogRepository
                .findByUserOrderByCreatedAtDesc(currentUser)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public BlogResponseDto updateBlog(
            Long id,
            BlogRequestDto request
    ) {

        Blogs blog =
                blogRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Blog not found with id: " + id
                                )
                        );

        User currentUser =
                currentUserService.getCurrentUser();

        checkOwnership(blog, currentUser);

        blog.setTitle(request.getTitle());
        blog.setContent(request.getContent());

        Blogs updatedBlog =
                blogRepository.save(blog);

        return mapToResponse(updatedBlog);
    }

    @Override
        @Transactional
    public void deleteBlog(Long id) {

        Blogs blog =
                blogRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Blog not found with id: " + id
                                )
                        );

        User currentUser =
                currentUserService.getCurrentUser();

        checkOwnership(blog, currentUser);

                likeRepository.deleteByBlog(blog);
                commentRepository.deleteByBlog(blog);
        blogRepository.delete(blog);
    }

    @Override
    public List<BlogResponseDto> getBlogByUsername(String username) {
        return blogRepository.findByUserUserNameOrderByCreatedAtDesc(username)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<BlogResponseDto> searchBlogs(String keyword) {
        if (keyword==null || keyword.trim().isEmpty()){
            return List.of();
        }

        return blogRepository
                .searchBlogs(keyword.trim())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private void checkOwnership(
            Blogs blog,
            User currentUser
    ) {

        boolean isOwner =
                blog.getUser()
                        .getId()
                        .equals(currentUser.getId());

        boolean isAdmin =
                currentUser.getRole()
                        .name()
                        .equals("ADMIN");

        if (!isOwner && !isAdmin) {

            throw new UnauthorizedException(
                    "You are not allowed to modify this blog"
            );
        }
    }

    private BlogResponseDto mapToResponse(Blogs blog) {

        long likeCount = likeRepository.countByBlog(blog);

        long commentCount = commentRepository.countByBlog(blog);

        boolean likedByCurrentUser = isLikedByCurrentUser(blog);

        return BlogResponseDto.builder()
                .id(blog.getId())
                .title(blog.getTitle())
                .content(blog.getContent())
                .username(blog.getUser().getUserName())
                .profileImage(blog.getUser().getProfileImage())
                .createdAt(blog.getCreatedAt())
                .updatedAt(blog.getUpdatedAt())
                .likeCount(likeCount)
                .commentCount(commentCount)
                .likedByCurrentUser(likedByCurrentUser)
                .build();
    }

    private BlogResponseDto mapProjectionToResponse(
            BlogSummaryProjection blog
    ) {

        return BlogResponseDto.builder()
                .id(blog.getId())
                .title(blog.getTitle())
                .content(blog.getContent())
                .username(blog.getUsername())
                .profileImage(blog.getProfileImage())
                .createdAt(blog.getCreatedAt())
                .updatedAt(blog.getUpdatedAt())
                .likeCount(blog.getLikeCount())
                .commentCount(blog.getCommentCount())
                .build();
    }

    private boolean isLikedByCurrentUser(Blogs blog) {

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return false;
        }

        String username = authentication.getName();

        User currentUser = userRepository
                        .findByUserName(username)
                        .orElse(null);

        if (currentUser == null) {
            return false;
        }

        return likeRepository.existsByUserAndBlog(currentUser, blog);
    }
}
