package com.scholarai.ai.dto;

import com.scholarai.writing.TargetLength;
import com.scholarai.writing.WritingTone;

import java.util.UUID;

public record InternalWritingRequest(UUID userId, UUID projectId, String inputText, WritingTone tone, TargetLength targetLength) {
}
