export type Role = "USER" | "ADMIN";
export type DocumentStatus = "UPLOADED" | "PROCESSING" | "READY" | "FAILED";
export type ChatRole = "USER" | "ASSISTANT" | "SYSTEM";
export type WritingTone = "ACADEMIC" | "SIMPLE" | "FORMAL" | "CONCISE";
export type TargetLength = "SHORT" | "MEDIUM" | "LONG";

export type ErrorResponse = {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
};

export type PageResponse<T> = {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
};

export type AuthUserResponse = {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: Role;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type ProjectResponse = {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateProjectRequest = {
  title: string;
  description?: string | null;
};

export type UpdateProjectRequest = {
  title: string;
  description?: string | null;
};

export type DocumentResponse = {
  id: string;
  projectId: string;
  originalFilename: string;
  contentType: string | null;
  fileSize: number | null;
  pageCount: number | null;
  status: DocumentStatus;
  failureReason: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Citation = {
  documentId: string;
  documentName: string;
  pageNumber: number | null;
  chunkId: string;
  quote: string;
  score: number;
};

export type Usage = {
  model: string;
  inputTokens: number;
  outputTokens: number;
};

export type CreateChatSessionRequest = {
  title: string;
};

export type ChatSessionResponse = {
  id: string;
  projectId: string;
  title: string;
  createdAt: string;
};

export type ChatMessageResponse = {
  id: string;
  role: ChatRole;
  content: string;
  citations: Citation[];
  createdAt: string;
};

export type ChatSessionDetailResponse = {
  id: string;
  projectId: string;
  title: string;
  createdAt: string;
  messages: ChatMessageResponse[];
};

export type SendChatMessageRequest = {
  message: string;
  documentIds: string[];
  topK: number;
};

export type SendChatMessageResponse = {
  userMessage: ChatMessageResponse;
  assistantMessage: ChatMessageResponse;
  usage: Usage;
};

export type WritingImproveRequest = {
  inputText: string;
  tone: WritingTone;
  targetLength: TargetLength;
};

export type WritingGenericResponse = {
  outputText: string;
  warnings: string[];
  usage: Usage;
};
