package org.project.blog.system.repository;


import org.project.blog.system.entity.Follow;
import org.project.blog.system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, Long> {

    Boolean existsByFollowerAndFollowing(User follower, User following);
    Optional<Follow> findByFollowerAndFollowing(User follower, User following);
    List<Follow> findByFollower(User follower);
    List<Follow> findByFollowing(User Following);
    Long countByFollower(User follower);
    Long countByFollowing(User following);

}
