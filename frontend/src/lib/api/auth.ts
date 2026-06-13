import { apiRequest } from "./client";
import type { AuthUserResponse, LoginRequest, RegisterRequest } from "./types";

export function register(data: RegisterRequest): Promise<AuthUserResponse> {
  return apiRequest("/api/auth/register", { method: "POST", body: data });
}

