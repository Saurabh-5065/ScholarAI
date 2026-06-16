package com.scholarai.chat;

import com.scholarai.chat.dto.*;
import com.scholarai.common.PageResponse;
import com.scholarai.security.CurrentUser;
import com.scholarai.user.User;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/projects/{projectId}/chat-sessions")
public class ChatController {
    private final ChatService service;

    public ChatController(ChatService service) {
        this.service = service;
    }

    @PostMapping
    public ChatSessionResponse create(@CurrentUser User user, @PathVariable UUID projectId, @Valid @RequestBody CreateChatSessionRequest request) {
        return service.create(user, projectId, request);
    }

    @GetMapping
    public PageResponse<ChatSessionResponse> list(@CurrentUser User user, @PathVariable UUID projectId, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return service.list(user, projectId, page, size);
    }

    @GetMapping("/{sessionId}")
    public ChatSessionDetailResponse detail(@CurrentUser User user, @PathVariable UUID projectId, @PathVariable UUID sessionId) {
        return service.detail(user, projectId, sessionId);
    }

    @PostMapping("/{sessionId}/messages")
    public SendChatMessageResponse send(@CurrentUser User user, @PathVariable UUID projectId, @PathVariable UUID sessionId, @Valid @RequestBody SendChatMessageRequest request) {
        return service.send(user, projectId, sessionId, request);
    }
}
