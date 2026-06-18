package com.scholarai.project;

import com.scholarai.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {
    Page<Project> findByUser(User user, Pageable pageable);
    Optional<Project> findByIdAndUser(UUID id, User user);
}
