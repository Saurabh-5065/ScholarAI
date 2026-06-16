package com.scholarai.chat;

import com.scholarai.ai.AiClient;
import com.scholarai.ai.AiUsageEvent;
import com.scholarai.ai.AiUsageEventRepository;
import com.scholarai.ai.dto.InternalRagQueryRequest;
import com.scholarai.chat.dto.*;
import com.scholarai.common.PageResponse;
import com.scholarai.document.DocumentRepository;
import com.scholarai.document.DocumentStatus;
import com.scholarai.exception.BadRequestException;
import com.scholarai.exception.ResourceNotFoundException;
import com.scholarai.project.Project;
import com.scholarai.project.ProjectService;
import com.scholarai.user.User;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ChatService {
    private final ProjectService projects;
    private final ChatSessionRepository sessions;
    private final ChatMessageRepository messages;
    private final DocumentRepository documents;
    private final AiClient aiClient;
    private final AiUsageEventRepository usageEvents;

    public ChatService(ProjectService projects, ChatSessionRepository sessions, ChatMessageRepository messages, DocumentRepository documents, AiClient aiClient, AiUsageEventRepository usageEvents) {
        this.projects = projects;
        this.sessions = sessions;
        this.messages = messages;
        this.documents = documents;
        this.aiClient = aiClient;
        this.usageEvents = usageEvents;
    }

    @Transactional
    public ChatSessionResponse create(User user, UUID projectId, CreateChatSessionRequest request) {
        Project project = projects.getOwnedProject(user, projectId);
        ChatSession session = new ChatSession();
        session.setProject(project);
        session.setUser(user);
        session.setTitle(request.title());
        return ChatSessionResponse.from(sessions.save(session));
    }

    @Transactional(readOnly = true)
    public PageResponse<ChatSessionResponse> list(User user, UUID projectId, int page, int size) {
        Project project = projects.getOwnedProject(user, projectId);
        return PageResponse.from(sessions.findByProjectAndUser(project, user, PageRequest.of(page, size)), ChatSessionResponse::from);
    }

    @Transactional(readOnly = true)
    public ChatSessionDetailResponse detail(User user, UUID projectId, UUID sessionId) {
        Project project = projects.getOwnedProject(user, projectId);
        ChatSession session = getSession(user, project, sessionId);
        return ChatSessionDetailResponse.of(session, messages.findBySessionOrderByCreatedAtAsc(session).stream().map(ChatMessageResponse::from).toList());
    }

    @Transactional
    public SendChatMessageResponse send(User user, UUID projectId, UUID sessionId, SendChatMessageRequest request) {
        Project project = projects.getOwnedProject(user, projectId);
        ChatSession session = getSession(user, project, sessionId);
        List<UUID> docIds = request.documentIds() == null ? List.of() : request.documentIds();
        var foundDocs = documents.findByIdInAndProjectAndUser(docIds, project, user);
        if (foundDocs.size() != docIds.size() || foundDocs.stream().anyMatch(d -> d.getStatus() != DocumentStatus.READY)) {
            throw new BadRequestException("All documentIds must belong to the project and be READY");
        }
        ChatMessage userMessage = newMessage(session, ChatRole.USER, request.message(), List.of());
        var rag = aiClient.ragQuery(new InternalRagQueryRequest(user.getId(), projectId, sessionId, request.message(), docIds, request.topK() == null ? 8 : request.topK()));
        ChatMessage assistantMessage = newMessage(session, ChatRole.ASSISTANT, rag.answer(), rag.citations() == null ? List.of() : rag.citations());
        saveUsage(user, "RAG_QUERY", rag.usage());
        return new SendChatMessageResponse(ChatMessageResponse.from(userMessage), ChatMessageResponse.from(assistantMessage), rag.usage());
    }

    private ChatSession getSession(User user, Project project, UUID sessionId) {
        return sessions.findByIdAndProjectAndUser(sessionId, project, user).orElseThrow(() -> new ResourceNotFoundException("Chat session not found"));
    }

    private ChatMessage newMessage(ChatSession session, ChatRole role, String content, List<CitationDto> citations) {
        ChatMessage message = new ChatMessage();
        message.setSession(session);
        message.setRole(role);
        message.setContent(content);
        message.setCitations(citations);
        return messages.save(message);
    }

    private void saveUsage(User user, String eventType, UsageDto usage) {
        if (usage == null) return;
        AiUsageEvent event = new AiUsageEvent();
        event.setUser(user);
        event.setEventType(eventType);
        event.setModel(usage.model());
        event.setInputTokens(usage.inputTokens());
        event.setOutputTokens(usage.outputTokens());
        usageEvents.save(event);
    }
}
