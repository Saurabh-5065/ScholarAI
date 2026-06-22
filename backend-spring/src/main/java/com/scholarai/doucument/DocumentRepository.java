package com.scholarai.document;

import com.scholarai.project.Project;
import com.scholarai.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DocumentRepository extends JpaRepository<Document, UUID> {
    Page<Document> findByProjectAndUser(Project project, User user, Pageable pageable);
    Optional<Document> findByIdAndProjectAndUser(UUID id, Project project, User user);
    List<Document> findByIdInAndProjectAndUser(Collection<UUID> ids, Project project, User user);
}
