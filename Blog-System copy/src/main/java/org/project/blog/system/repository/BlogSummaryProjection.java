package org.project.blog.system.repository;


import java.time.LocalDateTime;

public interface BlogSummaryProjection {

    Long getId();

    String getTitle();

    String getContent();

    String getUsername();

    String getProfileImage();

    LocalDateTime getCreatedAt();

    LocalDateTime getUpdatedAt();

    long getLikeCount();

    long getCommentCount();
}