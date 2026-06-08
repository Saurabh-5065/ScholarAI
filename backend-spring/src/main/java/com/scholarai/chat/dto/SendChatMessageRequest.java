package com.scholarai.chat.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

import java.util.List;
import java.util.UUID;

public record SendChatMessageRequest(
        @NotBlank(message = "Message is required") String message,
        List<UUID> documentIds,
        @Min(1) @Max(20) Integer topK
) {
}
