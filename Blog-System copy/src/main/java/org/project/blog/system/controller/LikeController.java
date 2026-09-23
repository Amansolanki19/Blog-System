package org.project.blog.system.controller;

import lombok.RequiredArgsConstructor;
import org.project.blog.system.dto.LikeUserResponseDto;
import org.project.blog.system.service.LikeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/blogs")
public class LikeController {
    private final LikeService likeService;

    @PostMapping("/{blogId}/like")
    public ResponseEntity<Void> likeBlog(@PathVariable Long blogId){
        likeService.likeBlog(blogId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{blogId}/unlike")
    public ResponseEntity<Void> unlikeBlog(@PathVariable Long blogId){
        likeService.unlikeBlog(blogId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{blogId}/likes")
    public ResponseEntity<List<LikeUserResponseDto>> getBlogLikes(@PathVariable Long blogId){
        return ResponseEntity.ok(likeService.getBlogLikes(blogId));
    }

    @GetMapping("/{blogId}/likes/count")
    public ResponseEntity<Long> getLikeCount(@PathVariable Long blogId){
        return ResponseEntity.ok(likeService.getLikeCount(blogId));
    }
}
