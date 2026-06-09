package com.scholarai.chat.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateChatSessionRequest(@NotBlank(message = "Title is required") @Size(max = 255) String title) {
}
