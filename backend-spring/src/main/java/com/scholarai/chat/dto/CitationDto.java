package com.scholarai.chat.dto;

import java.util.UUID;

public record CitationDto(UUID documentId, String documentName, Integer pageNumber, UUID chunkId, String quote, Double score) {
}
