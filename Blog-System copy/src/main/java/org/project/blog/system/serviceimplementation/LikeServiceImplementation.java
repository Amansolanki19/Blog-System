package org.project.blog.system.serviceimplementation;

import lombok.RequiredArgsConstructor;
import org.project.blog.system.dto.LikeUserResponseDto;
import org.project.blog.system.entity.Blogs;
import org.project.blog.system.entity.Like;
import org.project.blog.system.entity.User;
import org.project.blog.system.exception.ResourceAlreadyExistException;
import org.project.blog.system.exception.ResourceNotFoundException;
import org.project.blog.system.repository.BlogRepository;
import org.project.blog.system.repository.LikeRepository;
import org.project.blog.system.service.LikeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LikeServiceImplementation implements LikeService {

    private final LikeRepository likeRepository;
    private final BlogRepository blogRepository;
    private final CurrentUserService currentUserService;

    @Override
    public void likeBlog(Long blogId) {
        User user = currentUserService.getCurrentUser();
        Blogs blog = blogRepository.findById(blogId).orElseThrow(()-> new ResourceNotFoundException("Blog not found with id: " + blogId));

        if (likeRepository.existsByUserAndBlog(user,blog)){
            throw new ResourceAlreadyExistException("You have already liked this blog");
        }

        Like like = Like.builder()
                .user(user)
                .blog(blog)
                .build();

        likeRepository.save(like);
    }

    @Override
    @Transactional
    public void unlikeBlog(Long blogId) {
        User user = currentUserService.getCurrentUser();

        Blogs blog = blogRepository.findById(blogId).orElseThrow(()-> new ResourceNotFoundException(
                "Blog not found with id: "+blogId));

        Like like = likeRepository.findByUserAndBlog(user, blog)
            .orElseThrow(() -> new ResourceNotFoundException("You have not liked this blog"));

        likeRepository.delete(like);

    }

    @Override
    public List<LikeUserResponseDto> getBlogLikes(Long blogId) {
        Blogs blog = blogRepository.findById(blogId).orElseThrow(()-> new ResourceNotFoundException(
                "Blog not found with id: "+blogId));

        return likeRepository
                .findByBlogOrderByCreatedAtDesc(blog)
                .stream()
                .map(like -> mapToResponse(like.getUser())
                ).toList();
    }

    @Override
    public long getLikeCount(Long blogId) {
        Blogs blog = blogRepository.findById(blogId).orElseThrow(()-> new ResourceNotFoundException("Blog not found with id: "+blogId));

        return likeRepository.countByBlog(blog);
    }

    private LikeUserResponseDto mapToResponse(User user){
        return LikeUserResponseDto.builder()
                .id(user.getId())
                .username(user.getUserName())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .profileImage(user.getProfileImage())
                .build();

    }
}
