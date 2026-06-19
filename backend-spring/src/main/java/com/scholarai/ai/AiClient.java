package com.scholarai.ai;

import com.scholarai.ai.dto.*;
import com.scholarai.config.AppProperties;
import com.scholarai.exception.AiServiceException;
import org.springframework.boot.web.client.ClientHttpRequestFactories;
import org.springframework.boot.web.client.ClientHttpRequestFactorySettings;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.time.Duration;

@Component
public class AiClient {
    private final RestClient client;
    private final AppProperties properties;

    public AiClient(AppProperties properties) {
        this.properties = properties;
        this.client = RestClient.builder()
                .baseUrl(properties.aiServiceUrl())
                .requestFactory(ClientHttpRequestFactories.get(ClientHttpRequestFactorySettings.DEFAULTS
                        .withConnectTimeout(Duration.ofSeconds(10))
                        .withReadTimeout(Duration.ofSeconds(120))))
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader("X-Internal-Service-Token", properties.aiServiceToken())
                .build();
    }

    public IngestDocumentResponse ingestDocument(IngestDocumentRequest request) {
        return post("/internal/ingest", request, IngestDocumentResponse.class);
    }

    public InternalRagQueryResponse ragQuery(InternalRagQueryRequest request) {
        return post("/internal/rag/query", request, InternalRagQueryResponse.class);
    }

    public InternalWritingResponse writingTool(String path, InternalWritingRequest request) {
        return post(path, request, InternalWritingResponse.class);
    }

    private <T> T post(String path, Object body, Class<T> type) {
        try {
            return client.post().uri(path).body(body).retrieve().body(type);
        } catch (RestClientException ex) {
            throw new AiServiceException("AI service request failed");
        }
    }
}
