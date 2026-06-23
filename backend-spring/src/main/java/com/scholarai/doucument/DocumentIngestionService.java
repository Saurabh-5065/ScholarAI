package com.scholarai.document;

import com.scholarai.ai.AiClient;
import com.scholarai.ai.dto.IngestDocumentRequest;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class DocumentIngestionService {
    private final DocumentRepository documents;
    private final AiClient aiClient;

    public DocumentIngestionService(DocumentRepository documents, AiClient aiClient) {
        this.documents = documents;
        this.aiClient = aiClient;
    }

    @Async("documentIngestionExecutor")
    @Transactional
    public void ingestAsync(UUID documentId) {
        Document document = documents.findById(documentId).orElseThrow();
        try {
            var response = aiClient.ingestDocument(new IngestDocumentRequest(document.getId(), document.getProject().getId(), document.getUser().getId(),
                    document.getStoredPath(), document.getOriginalFilename(), document.getContentType()));
            document.setStatus(response.status());
            document.setPageCount(response.pageCount());
            document.setFailureReason(null);
        } catch (Exception ex) {
            document.setStatus(DocumentStatus.FAILED);
            document.setFailureReason(ex.getMessage());
        }
    }
}
