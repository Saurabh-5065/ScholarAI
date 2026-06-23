package com.scholarai.document;

import com.scholarai.config.AppProperties;
import com.scholarai.exception.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageService {
    private static final Set<String> CONTENT_TYPES = Set.of(
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "text/plain",
            "text/markdown"
    );
    private static final Set<String> EXTENSIONS = Set.of("pdf", "docx", "txt", "md");
    private final AppProperties properties;

    public FileStorageService(AppProperties properties) {
        this.properties = properties;
    }

    public StoredFile store(MultipartFile file, UUID userId, UUID projectId, UUID documentId) {
        if (file.isEmpty()) throw new BadRequestException("File must not be empty");
        String original = StringUtils.cleanPath(file.getOriginalFilename() == null ? "document" : file.getOriginalFilename());
        String ext = extension(original);
        if (!EXTENSIONS.contains(ext) || (file.getContentType() != null && !CONTENT_TYPES.contains(file.getContentType()))) {
            throw new BadRequestException("Unsupported file type");
        }
        String safe = original.replaceAll("[^A-Za-z0-9._-]", "_");
        Path dir = Path.of(properties.uploadDir(), userId.toString(), projectId.toString());
        Path path = dir.resolve(documentId + "-" + safe);
        try {
            Files.createDirectories(dir);
            file.transferTo(path);
        } catch (IOException ex) {
            throw new BadRequestException("Unable to store file");
        }
        return new StoredFile(path.toString(), original, file.getContentType(), file.getSize());
    }

    private String extension(String name) {
        int i = name.lastIndexOf('.');
        return i == -1 ? "" : name.substring(i + 1).toLowerCase(Locale.ROOT);
    }

    public record StoredFile(String storedPath, String originalFilename, String contentType, long fileSize) {
    }
}
