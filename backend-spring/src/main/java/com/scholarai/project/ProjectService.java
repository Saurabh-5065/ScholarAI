package com.scholarai.project;

import com.scholarai.common.PageResponse;
import com.scholarai.exception.ResourceNotFoundException;
import com.scholarai.project.dto.CreateProjectRequest;
import com.scholarai.project.dto.ProjectResponse;
import com.scholarai.project.dto.UpdateProjectRequest;
import com.scholarai.user.User;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class ProjectService {
    private final ProjectRepository projects;

    public ProjectService(ProjectRepository projects) {
        this.projects = projects;
    }

    @Transactional
    public ProjectResponse create(User user, CreateProjectRequest request) {
        Project project = new Project();
        project.setUser(user);
        project.setTitle(request.title());
        project.setDescription(request.description());
        return ProjectResponse.from(projects.save(project));
    }

    @Transactional(readOnly = true)
    public PageResponse<ProjectResponse> list(User user, int page, int size) {
        return PageResponse.from(projects.findByUser(user, PageRequest.of(page, size)), ProjectResponse::from);
    }

    @Transactional(readOnly = true)
    public Project getOwnedProject(User user, UUID id) {
        return projects.findByIdAndUser(id, user).orElseThrow(() -> new ResourceNotFoundException("Project not found"));
    }

    @Transactional(readOnly = true)
    public ProjectResponse get(User user, UUID id) {
        return ProjectResponse.from(getOwnedProject(user, id));
    }

    @Transactional
    public ProjectResponse update(User user, UUID id, UpdateProjectRequest request) {
        Project project = getOwnedProject(user, id);
        project.setTitle(request.title());
        project.setDescription(request.description());
        return ProjectResponse.from(project);
    }

    @Transactional
    public void delete(User user, UUID id) {
        projects.delete(getOwnedProject(user, id));
    }
}
