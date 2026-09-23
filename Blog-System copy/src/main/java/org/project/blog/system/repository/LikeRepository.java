package org.project.blog.system.repository;

import org.project.blog.system.entity.Blogs;
import org.project.blog.system.entity.Like;
import org.project.blog.system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like,Long> {
    Boolean existsByUserAndBlog(User user, Blogs blog);
    Optional<Like> findByUserAndBlog(User user, Blogs blog);
    void deleteByUserAndBlog(User user, Blogs blog);
    void deleteByBlog(Blogs blog);
    List<Like> findByBlogOrderByCreatedAtDesc(Blogs blog);
    Long countByBlog(Blogs blog);
}
