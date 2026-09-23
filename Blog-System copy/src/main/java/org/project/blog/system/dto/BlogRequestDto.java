package org.project.blog.system.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class BlogRequestDto {

    @NotBlank(message = "Title cannot be blank")
    @Size(
            min = 3,
            max = 200,
            message = "Title must be between 3 and 200 characters"
    )
    private String title;

    @NotBlank(message = "Content cannot be blank")
    @Size(
            min = 1,
            max = 10000,
            message = "Content cannot exceed 10000 characters"
    )
    private String content;
}
