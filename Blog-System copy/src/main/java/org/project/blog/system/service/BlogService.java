package org.project.blog.system.service;




import org.project.blog.system.dto.BlogRequestDto;
import org.project.blog.system.dto.BlogResponseDto;

import java.util.List;

public interface BlogService {

    BlogResponseDto createBlog(BlogRequestDto request);

    List<BlogResponseDto> getAllBlogs();

    BlogResponseDto getBlogById(Long id);

    List<BlogResponseDto> getMyBlogs();

    BlogResponseDto updateBlog(Long id, BlogRequestDto request);

    void deleteBlog(Long id);

    List<BlogResponseDto> getBlogByUsername(String username);

    List<BlogResponseDto> searchBlogs(String keyword);
}
