package com.scholarai.ai.dto;

import com.scholarai.document.DocumentStatus;

import java.util.UUID;

public record IngestDocumentResponse(UUID documentId, DocumentStatus status, int chunksCreated, Integer pageCount) {
}
