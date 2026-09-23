package org.project.blog.system.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.project.blog.system.dto.CommentRequestDto;
import org.project.blog.system.dto.CommentResponseDto;
import org.project.blog.system.service.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @PostMapping("/api/blogs/{blogId}/comments")
    public ResponseEntity<CommentResponseDto> createComment(@PathVariable Long blogId, @Valid @RequestBody CommentRequestDto request){
        return ResponseEntity.ok(commentService.createComment(blogId,request));
    }

    @GetMapping("/api/blogs/{blogId}/comments")
    public ResponseEntity<List<CommentResponseDto>> getBlogComments(@PathVariable Long blogId){
        return ResponseEntity.ok(commentService.getBlogComments(blogId));
    }

    @PutMapping("/api/comments/{commentId}")
    public ResponseEntity<CommentResponseDto> updateComment(@PathVariable Long commentId, @Valid @RequestBody CommentRequestDto request){
        return ResponseEntity.ok(commentService.updateComment(commentId,request));
    }

    @DeleteMapping("/api/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId){
        commentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }
}
