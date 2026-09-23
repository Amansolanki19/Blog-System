package org.project.blog.system.repository;

import org.project.blog.system.entity.Blogs;
import org.project.blog.system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogRepository extends JpaRepository<Blogs,Long> {
    List<Blogs> findByUser(User user);

    List<Blogs> findByUserOrderByCreatedAtDesc(User user);

    Long countByUser(User user);

    List<Blogs> findByUserUserNameOrderByCreatedAtDesc(String username);

    @Query("""
        SELECT
            b.id AS id,
            b.title AS title,
            b.content AS content,
            b.user.userName AS username,
            b.user.profileImage AS profileImage,
            b.createdAt AS createdAt,
            b.updatedAt AS updatedAt,
            COUNT(DISTINCT l.id) AS likeCount,
            COUNT(DISTINCT c.id) AS commentCount
        FROM Blogs b
        LEFT JOIN Like l
            ON l.blog = b
        LEFT JOIN Comment c
            ON c.blog = b
        GROUP BY
            b.id,
            b.title,
            b.content,
            b.user.userName,
            b.user.profileImage,
            b.createdAt,
            b.updatedAt
        ORDER BY b.createdAt DESC
    """)
    List<BlogSummaryProjection> findAllBlogSummaries();

    @Query("""
    SELECT b
    FROM Blogs b
    WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
       OR LOWER(b.content) LIKE LOWER(CONCAT('%', :keyword, '%'))
       OR LOWER(b.user.userName) LIKE LOWER(CONCAT('%', :keyword, '%'))
    ORDER BY b.createdAt DESC
    """)
    List<Blogs> searchBlogs(@Param("keyword") String keyword);
}
