package org.project.blog.system.service;

import org.project.blog.system.dto.CommentRequestDto;
import org.project.blog.system.dto.CommentResponseDto;

import java.util.List;

public interface CommentService {
    CommentResponseDto createComment(Long blogId, CommentRequestDto request);
    List<CommentResponseDto> getBlogComments(Long blogId);
    CommentResponseDto updateComment(Long commentId, CommentRequestDto request);
    void deleteComment(Long commentId);
}
