package com.scholarai.ai.dto;

import com.scholarai.chat.dto.UsageDto;

import java.util.List;

public record InternalWritingResponse(String outputText, List<String> warnings, UsageDto usage) {
}
