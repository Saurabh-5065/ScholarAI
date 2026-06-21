package com.scholarai.writing.dto;

import com.scholarai.writing.TargetLength;
import com.scholarai.writing.WritingTone;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record WritingImproveRequest(
        @NotBlank(message = "Input text is required") String inputText,
        @NotNull WritingTone tone,
        @NotNull TargetLength targetLength
) {
}
