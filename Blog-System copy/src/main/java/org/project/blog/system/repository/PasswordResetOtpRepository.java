package org.project.blog.system.repository;



import org.project.blog.system.entity.PasswordResetOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface PasswordResetOtpRepository extends JpaRepository<PasswordResetOtp, Long> {

    Optional<PasswordResetOtp> findTopByEmailOrderByCreatedAtDesc(String email);

    @Modifying
    @Transactional
    @Query("""
    UPDATE PasswordResetOtp p
    SET p.used = true
    WHERE p.email = :email
      AND p.used = false
    """)
    void invalidatePreviousOtps(@Param("email") String email);
}