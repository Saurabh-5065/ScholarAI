package com.scholarai.writing.dto;

import com.scholarai.ai.dto.InternalWritingResponse;
import com.scholarai.chat.dto.UsageDto;

import java.util.List;

public record WritingGenericResponse(String outputText, List<String> warnings, UsageDto usage) {
    public static WritingGenericResponse from(InternalWritingResponse response) {
        return new WritingGenericResponse(response.outputText(), response.warnings(), response.usage());
    }
}
