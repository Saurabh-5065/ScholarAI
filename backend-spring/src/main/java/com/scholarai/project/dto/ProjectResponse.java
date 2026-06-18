package com.scholarai.project.dto;

import com.scholarai.project.Project;

import java.time.Instant;
import java.util.UUID;

public record ProjectResponse(UUID id, String title, String description, Instant createdAt, Instant updatedAt) {
    public static ProjectResponse from(Project project) {
        return new ProjectResponse(project.getId(), project.getTitle(), project.getDescription(), project.getCreatedAt(), project.getUpdatedAt());
    }
}
