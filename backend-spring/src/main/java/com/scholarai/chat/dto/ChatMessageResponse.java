package com.scholarai.chat.dto;

import com.scholarai.chat.ChatMessage;
import com.scholarai.chat.ChatRole;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ChatMessageResponse(UUID id, ChatRole role, String content, List<CitationDto> citations, Instant createdAt) {
    public static ChatMessageResponse from(ChatMessage message) {
        return new ChatMessageResponse(message.getId(), message.getRole(), message.getContent(), message.getCitations(), message.getCreatedAt());
    }
}
