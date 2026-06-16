package com.scholarai.chat;

import com.scholarai.chat.dto.CitationDto;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "chat_messages")
public class ChatMessage {
    @Id
    private UUID id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "session_id")
    private ChatSession session;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChatRole role;
    @Column(nullable = false)
    private String content;
    @JdbcTypeCode(SqlTypes.JSON)
    private List<CitationDto> citations = new ArrayList<>();
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
    @PrePersist void prePersist() { if (id == null) id = UUID.randomUUID(); createdAt = Instant.now(); }
    public UUID getId() { return id; }
    public ChatSession getSession() { return session; }
    public void setSession(ChatSession session) { this.session = session; }
    public ChatRole getRole() { return role; }
    public void setRole(ChatRole role) { this.role = role; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public List<CitationDto> getCitations() { return citations == null ? List.of() : citations; }
    public void setCitations(List<CitationDto> citations) { this.citations = citations; }
    public Instant getCreatedAt() { return createdAt; }
}
