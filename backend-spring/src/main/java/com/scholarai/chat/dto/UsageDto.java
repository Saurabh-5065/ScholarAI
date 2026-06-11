package com.scholarai.chat.dto;

public record UsageDto(String model, Integer inputTokens, Integer outputTokens) {
}
