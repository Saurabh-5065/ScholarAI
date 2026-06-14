package com.scholarai.chat.dto;

import com.scholarai.chat.ChatSession;

import java.time.Instant;
import java.util.UUID;

public record ChatSessionResponse(UUID id, UUID projectId, String title, Instant createdAt) {
    public static ChatSessionResponse from(ChatSession session) {
        return new ChatSessionResponse(session.getId(), session.getProject().getId(), session.getTitle(), session.getCreatedAt());
    }
}
