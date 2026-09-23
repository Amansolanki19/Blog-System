package org.project.blog.system.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "follow",
    uniqueConstraints = {
        @UniqueConstraint(
                columnNames = {
                        "follower_id",
                        "following_id"
                }
        )
    })
public class Follow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "follower_id",
            nullable = false
    )
    private User follower;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "following_id",
            nullable = false
    )
    private User following;

    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate(){
        createdAt=LocalDateTime.now();
    }
}
