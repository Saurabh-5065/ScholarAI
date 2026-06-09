package com.scholarai.chat.dto;

import com.scholarai.chat.ChatSession;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ChatSessionDetailResponse(UUID id, UUID projectId, String title, Instant createdAt, List<ChatMessageResponse> messages) {
    public static ChatSessionDetailResponse of(ChatSession session, List<ChatMessageResponse> messages) {
        return new ChatSessionDetailResponse(session.getId(), session.getProject().getId(), session.getTitle(), session.getCreatedAt(), messages);
    }
}
