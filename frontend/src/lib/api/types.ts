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