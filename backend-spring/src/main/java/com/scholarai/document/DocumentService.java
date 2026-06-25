package com.scholarai.document;

import com.scholarai.common.PageResponse;
import com.scholarai.document.dto.DocumentResponse;
import com.scholarai.exception.ResourceNotFoundException;
import com.scholarai.project.Project;
import com.scholarai.project.ProjectService;
import com.scholarai.user.User;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
public class DocumentService {
    private final DocumentRepository documents;
    private final ProjectService projects;
    private final FileStorageService storage;
    private final DocumentIngestionService ingestionService;

    public DocumentService(DocumentRepository documents, ProjectService projects, FileStorageService storage, DocumentIngestionService ingestionService) {
        this.documents = documents;
        this.projects = projects;
        this.storage = storage;
        this.ingestionService = ingestionService;
    }

    @Transactional
    public DocumentResponse upload(User user, UUID projectId, MultipartFile file) {
        Project project = projects.getOwnedProject(user, projectId);
        Document document = new Document();
        document.setId(UUID.randomUUID());
        var stored = storage.store(file, user.getId(), projectId, document.getId());
        document.setProject(project);
        document.setUser(user);
        document.setOriginalFilename(stored.originalFilename());
        document.setStoredPath(stored.storedPath());
        document.setContentType(stored.contentType());
        document.setFileSize(stored.fileSize());
        document.setStatus(DocumentStatus.PROCESSING);
        document = documents.save(document);
        scheduleIngestionAfterCommit(document.getId());
        return DocumentResponse.from(document);
    }

    @Transactional(readOnly = true)
    public PageResponse<DocumentResponse> list(User user, UUID projectId, int page, int size) {
        Project project = projects.getOwnedProject(user, projectId);
        return PageResponse.from(documents.findByProjectAndUser(project, user, PageRequest.of(page, size)), DocumentResponse::from);
    }

    @Transactional(readOnly = true)
    public Document getOwned(User user, Project project, UUID id) {
        return documents.findByIdAndProjectAndUser(id, project, user).orElseThrow(() -> new ResourceNotFoundException("Document not found"));
    }

    @Transactional(readOnly = true)
    public DocumentResponse get(User user, UUID projectId, UUID documentId) {
        Project project = projects.getOwnedProject(user, projectId);
        return DocumentResponse.from(getOwned(user, project, documentId));
    }

    @Transactional
    public void delete(User user, UUID projectId, UUID documentId) {
        Project project = projects.getOwnedProject(user, projectId);
        documents.delete(getOwned(user, project, documentId));
    }

    @Transactional
    public DocumentResponse reprocess(User user, UUID projectId, UUID documentId) {
        Project project = projects.getOwnedProject(user, projectId);
        Document document = getOwned(user, project, documentId);
        document.setStatus(DocumentStatus.PROCESSING);
        document.setFailureReason(null);
        scheduleIngestionAfterCommit(document.getId());
        return DocumentResponse.from(document);
    }

    private void scheduleIngestionAfterCommit(UUID documentId) {
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                ingestionService.ingestAsync(documentId);
            }
        });
    }
}
