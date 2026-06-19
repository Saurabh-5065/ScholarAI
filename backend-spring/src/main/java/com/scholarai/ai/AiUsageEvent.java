package com.scholarai.ai;

import com.scholarai.user.User;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "ai_usage_events")
public class AiUsageEvent {
    @Id
    private UUID id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;
    @Column(name = "event_type", nullable = false)
    private String eventType;
    private String model;
    @Column(name = "input_tokens")
    private Integer inputTokens = 0;
    @Column(name = "output_tokens")
    private Integer outputTokens = 0;
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @PrePersist
    void prePersist() {
        if (id == null) id = UUID.randomUUID();
        createdAt = Instant.now();
    }

    public void setUser(User user) { this.user = user; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    public void setModel(String model) { this.model = model; }
    public void setInputTokens(Integer inputTokens) { this.inputTokens = inputTokens; }
    public void setOutputTokens(Integer outputTokens) { this.outputTokens = outputTokens; }
}
