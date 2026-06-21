package com.scholarai.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateProjectRequest(
        @NotBlank(message = "Title is required") @Size(max = 255) String title,
        String description
) {
}
