package org.project.blog.system.serviceimplementation;

import lombok.RequiredArgsConstructor;
import org.project.blog.system.dto.CommentRequestDto;
import org.project.blog.system.dto.CommentResponseDto;
import org.project.blog.system.entity.Blogs;
import org.project.blog.system.entity.Comment;
import org.project.blog.system.entity.User;
import org.project.blog.system.enums.Roles;
import org.project.blog.system.exception.ResourceNotFoundException;
import org.project.blog.system.exception.UnauthorizedException;
import org.project.blog.system.repository.BlogRepository;
import org.project.blog.system.repository.CommentRepository;
import org.project.blog.system.service.CommentService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentServiceImplementation implements CommentService {

    private final CommentRepository commentRepository;
    private final BlogRepository blogRepository;
    private final CurrentUserService currentUserService;

    @Override
    public CommentResponseDto createComment(Long blogId, CommentRequestDto request) {
        User currentUser = currentUserService.getCurrentUser();

        Blogs blog = blogRepository.findById(blogId).orElseThrow(()-> new ResourceNotFoundException("Blog not found with id: "+blogId));
        
        Comment comment = Comment.builder()
                .content(request.getContent())
                .user(currentUser)
                .blog(blog)
                .build();

        return mapToResponse(commentRepository.save(comment));
    }

    @Override
    public List<CommentResponseDto> getBlogComments(Long blogId) {
        Blogs blog =blogRepository.findById(blogId).orElseThrow(()-> new ResourceNotFoundException("Blog not found with id: "+blogId));

        return commentRepository
                .findByBlogOrderByCreatedAtDesc(blog)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public CommentResponseDto updateComment(Long commentId, CommentRequestDto request) {
        User currentUser = currentUserService.getCurrentUser();

        Comment comment = findComment(commentId);

        checkOwnership(comment,currentUser);
        comment.setContent(request.getContent());

        Comment updateComment = commentRepository.save(comment);

        return mapToResponse(updateComment);
    }

    @Override
    public void deleteComment(Long commentId) {

        User currentUser = currentUserService.getCurrentUser();
        Comment comment = findComment(commentId);

        checkOwnership(comment,currentUser);
        commentRepository.delete(comment);

    }

    private Comment findComment(Long commentId){
        return commentRepository.findById(commentId).orElseThrow(()-> new ResourceNotFoundException("Comment not found with id: "+commentId));

    }

    private void checkOwnership(Comment comment, User currentUser){
        boolean isOwner = comment.getUser()
                .getId()
                .equals(currentUser.getId());

        boolean isAdmin = currentUser.getRole()== Roles.ADMIN;

        if(!isAdmin && !isOwner){
            throw new UnauthorizedException(" You are not allowed to modify this comment");
        }
    }

    private CommentResponseDto mapToResponse(Comment comment) {

        User user = comment.getUser();

        return CommentResponseDto.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .username(user.getUserName())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .profileImage(user.getProfileImage())
                .blogId(comment.getBlog().getId())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }

}
