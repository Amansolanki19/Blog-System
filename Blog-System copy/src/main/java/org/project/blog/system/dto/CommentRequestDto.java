package org.project.blog.system.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CommentRequestDto {

    @NotBlank(message = "Comment cannot be blank")
    @Size(
            min = 1,
            max = 2000,
            message = "Comment must be between 1 and 2000 characters"
    )
    private String content;
}