package com.scholarai.project;

import com.scholarai.common.PageResponse;
import com.scholarai.project.dto.CreateProjectRequest;
import com.scholarai.project.dto.ProjectResponse;
import com.scholarai.project.dto.UpdateProjectRequest;
import com.scholarai.security.CurrentUser;
import com.scholarai.user.User;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectService service;

    public ProjectController(ProjectService service) {
        this.service = service;
    }

    @PostMapping
    public ProjectResponse create(@CurrentUser User user, @Valid @RequestBody CreateProjectRequest request) {
        return service.create(user, request);
    }

    @GetMapping
    public PageResponse<ProjectResponse> list(@CurrentUser User user, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return service.list(user, page, size);
    }

    @GetMapping("/{projectId}")
    public ProjectResponse get(@CurrentUser User user, @PathVariable UUID projectId) {
        return service.get(user, projectId);
    }

    @PutMapping("/{projectId}")
    public ProjectResponse update(@CurrentUser User user, @PathVariable UUID projectId, @Valid @RequestBody UpdateProjectRequest request) {
        return service.update(user, projectId, request);
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> delete(@CurrentUser User user, @PathVariable UUID projectId) {
        service.delete(user, projectId);
        return ResponseEntity.noContent().build();
    }
}
