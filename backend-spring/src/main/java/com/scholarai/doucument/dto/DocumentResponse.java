package com.scholarai.document.dto;

import com.scholarai.document.Document;
import com.scholarai.document.DocumentStatus;

import java.time.Instant;
import java.util.UUID;

public record DocumentResponse(
        UUID id,
        UUID projectId,
        String originalFilename,
        String contentType,
        Long fileSize,
        Integer pageCount,
        DocumentStatus status,
        String failureReason,
        Instant createdAt,
        Instant updatedAt
) {
    public static DocumentResponse from(Document document) {
        return new DocumentResponse(document.getId(), document.getProject().getId(), document.getOriginalFilename(), document.getContentType(),
                document.getFileSize(), document.getPageCount(), document.getStatus(), document.getFailureReason(), document.getCreatedAt(), document.getUpdatedAt());
    }
}
