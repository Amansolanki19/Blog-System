package org.project.blog.system.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserProfileResponseDto {
    private Long id;
    private String username;
    private String firstName;
    private String lastName;
    private String bio;
    private String profileImage;
    private long blogCount;
    private long followersCount;
    private long followingCount;
    @JsonProperty("isFollowing")
    private boolean isFollowing;
}
