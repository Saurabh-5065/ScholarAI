package com.scholarai.chat.dto;

public record SendChatMessageResponse(ChatMessageResponse userMessage, ChatMessageResponse assistantMessage, UsageDto usage) {
}
