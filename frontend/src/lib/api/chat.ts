import { apiRequest } from "./client";
import type {
  ChatSessionDetailResponse,
  ChatSessionResponse,
  CreateChatSessionRequest,
  PageResponse,
  SendChatMessageRequest,
  SendChatMessageResponse,
} from "./types";

export function createChatSession(
  projectId: string,
  data: CreateChatSessionRequest,
): Promise<ChatSessionResponse> {
  return apiRequest(`/api/projects/${projectId}/chat-sessions`, {
    method: "POST",
    body: data,
  });
}

export function listChatSessions(
  projectId: string,
): Promise<PageResponse<ChatSessionResponse>> {
  return apiRequest(`/api/projects/${projectId}/chat-sessions`);
}

export function getChatSession(
  projectId: string,
  sessionId: string,
): Promise<ChatSessionDetailResponse> {
  return apiRequest(`/api/projects/${projectId}/chat-sessions/${sessionId}`);
}

export function sendChatMessage(
  projectId: string,
  sessionId: string,
  data: SendChatMessageRequest,
): Promise<SendChatMessageResponse> {
  return apiRequest(
    `/api/projects/${projectId}/chat-sessions/${sessionId}/messages`,
    { method: "POST", body: data },
  );
}
