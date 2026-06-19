package com.scholarai.ai.dto;

import java.util.UUID;

public record IngestDocumentRequest(UUID documentId, UUID projectId, UUID userId, String storedPath, String originalFilename, String contentType) {
}
