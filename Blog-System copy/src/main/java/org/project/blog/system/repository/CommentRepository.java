package org.project.blog.system.repository;

import org.project.blog.system.entity.Blogs;
import org.project.blog.system.entity.Comment;
import org.project.blog.system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment,Long> {
    List<Comment> findByBlogOrderByCreatedAtDesc(Blogs blog);
    List<Comment> findByUserOrderByCreatedAtDesc(User user);
    void deleteByBlog(Blogs blog);
    Long countByBlog(Blogs blog);
}
