package com.scholarai.document;

import com.scholarai.common.PageResponse;
import com.scholarai.document.dto.DocumentResponse;
import com.scholarai.security.CurrentUser;
import com.scholarai.user.User;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/projects/{projectId}/documents")
public class DocumentController {
    private final DocumentService service;

    public DocumentController(DocumentService service) {
        this.service = service;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public DocumentResponse upload(@CurrentUser User user, @PathVariable UUID projectId, @RequestPart("file") MultipartFile file) {
        return service.upload(user, projectId, file);
    }

    @GetMapping
    public PageResponse<DocumentResponse> list(@CurrentUser User user, @PathVariable UUID projectId, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return service.list(user, projectId, page, size);
    }

    @GetMapping("/{documentId}")
    public DocumentResponse get(@CurrentUser User user, @PathVariable UUID projectId, @PathVariable UUID documentId) {
        return service.get(user, projectId, documentId);
    }

    @DeleteMapping("/{documentId}")
    public ResponseEntity<Void> delete(@CurrentUser User user, @PathVariable UUID projectId, @PathVariable UUID documentId) {
        service.delete(user, projectId, documentId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{documentId}/reprocess")
    public DocumentResponse reprocess(@CurrentUser User user, @PathVariable UUID projectId, @PathVariable UUID documentId) {
        return service.reprocess(user, projectId, documentId);
    }
}
