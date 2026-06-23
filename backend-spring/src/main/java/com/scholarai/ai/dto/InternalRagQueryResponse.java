package com.scholarai.ai.dto;

import com.scholarai.chat.dto.CitationDto;
import com.scholarai.chat.dto.UsageDto;

import java.util.List;

public record InternalRagQueryResponse(String answer, List<CitationDto> citations, UsageDto usage) {
}
