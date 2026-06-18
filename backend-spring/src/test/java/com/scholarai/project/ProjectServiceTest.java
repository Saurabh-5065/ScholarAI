package com.scholarai.project;

import com.scholarai.exception.ResourceNotFoundException;
import com.scholarai.project.dto.CreateProjectRequest;
import com.scholarai.user.User;
import org.junit.jupiter.api.Test;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ProjectServiceTest {
    private final ProjectRepository repository = mock(ProjectRepository.class);
    private final ProjectService service = new ProjectService(repository);

    @Test
    void createsProjectForCurrentUser() {
        User user = new User();
        user.setId(UUID.randomUUID());
        when(repository.save(any(Project.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var response = service.create(user, new CreateProjectRequest("Fake News Detection Literature Review", "Research notes"));

        assertThat(response.title()).isEqualTo("Fake News Detection Literature Review");
        verify(repository).save(argThat(project -> project.getUser() == user));
    }

    @Test
    void getOwnedProjectRejectsMissingOrOtherUserProject() {
        User user = new User();
        UUID projectId = UUID.randomUUID();
        when(repository.findByIdAndUser(projectId, user)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getOwnedProject(user, projectId))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
