package com.scholarai.chat;

import com.scholarai.project.Project;
import com.scholarai.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ChatSessionRepository extends JpaRepository<ChatSession, UUID> {
    Page<ChatSession> findByProjectAndUser(Project project, User user, Pageable pageable);
    Optional<ChatSession> findByIdAndProjectAndUser(UUID id, Project project, User user);
}
