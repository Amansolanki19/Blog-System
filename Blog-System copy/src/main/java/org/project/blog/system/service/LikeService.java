package org.project.blog.system.service;

import org.project.blog.system.dto.LikeUserResponseDto;

import java.util.List;

public interface LikeService {
    void likeBlog(Long blogId);
    void unlikeBlog(Long blogId);
    List<LikeUserResponseDto> getBlogLikes(Long blogId);
    long getLikeCount(Long blogId);
}
