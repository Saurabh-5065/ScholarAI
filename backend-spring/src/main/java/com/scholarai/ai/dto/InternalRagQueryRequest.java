package com.scholarai.ai.dto;

import java.util.List;
import java.util.UUID;

public record InternalRagQueryRequest(UUID userId, UUID projectId, UUID sessionId, String message, List<UUID> documentIds, Integer topK) {
}
