package com.scholarai.writing;

import com.scholarai.ai.AiClient;
import com.scholarai.ai.AiUsageEvent;
import com.scholarai.ai.AiUsageEventRepository;
import com.scholarai.ai.dto.InternalWritingRequest;
import com.scholarai.user.User;
import com.scholarai.writing.dto.WritingGenericResponse;
import com.scholarai.writing.dto.WritingImproveRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class WritingService {
    private final AiClient aiClient;
    private final AiUsageEventRepository usageEvents;

    public WritingService(AiClient aiClient, AiUsageEventRepository usageEvents) {
        this.aiClient = aiClient;
        this.usageEvents = usageEvents;
    }

    @Transactional
    public WritingGenericResponse execute(User user, String path, WritingImproveRequest request) {
        var response = aiClient.writingTool(path, new InternalWritingRequest(user.getId(), null, request.inputText(), request.tone(), request.targetLength()));
        if (response.usage() != null) {
            AiUsageEvent event = new AiUsageEvent();
            event.setUser(user);
            event.setEventType("WRITING_TOOL");
            event.setModel(response.usage().model());
            event.setInputTokens(response.usage().inputTokens());
            event.setOutputTokens(response.usage().outputTokens());
            usageEvents.save(event);
        }
        return WritingGenericResponse.from(response);
    }
}
