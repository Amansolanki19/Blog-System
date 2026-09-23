package org.project.blog.system.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.project.blog.system.dto.BlogRequestDto;
import org.project.blog.system.dto.BlogResponseDto;
import org.project.blog.system.service.BlogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blogs")
@RequiredArgsConstructor
public class BlogController {
    private final BlogService blogService;

    @PostMapping("/new")
    public ResponseEntity<BlogResponseDto> createBlog(@Valid @RequestBody BlogRequestDto request){
        return ResponseEntity.ok(blogService.createBlog(request));
    }

    @GetMapping
    public ResponseEntity<List<BlogResponseDto>> getAllBlogs(){
        return ResponseEntity.ok(blogService.getAllBlogs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BlogResponseDto> getBlogById(@PathVariable Long id){
        return ResponseEntity.ok(blogService.getBlogById(id));
    }

    @GetMapping("/my")
    public ResponseEntity<List<BlogResponseDto>> getMyBlogs(){
        return ResponseEntity.ok(blogService.getMyBlogs());
    }

    @PutMapping("/{id}")
    public ResponseEntity<BlogResponseDto> updateBlog(@Valid @RequestBody BlogRequestDto request,
                                                      @PathVariable Long id){
        return ResponseEntity.ok(blogService.updateBlog(id,request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBlog(@PathVariable Long id){
        blogService.deleteBlog(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<BlogResponseDto>> getBlogsByUsername(@PathVariable String username){
        return ResponseEntity.ok(blogService.getBlogByUsername(username));
    }

    @GetMapping("/search")
    public ResponseEntity<List<BlogResponseDto>> searchBlogs(@RequestParam String keyword){
        return ResponseEntity.ok(blogService.searchBlogs(keyword));
    }
}
