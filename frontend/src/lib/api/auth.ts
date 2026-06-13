import { apiRequest } from "./client";
import type { AuthUserResponse, LoginRequest, RegisterRequest } from "./types";

export function register(data: RegisterRequest): Promise<AuthUserResponse> {
  return apiRequest("/api/auth/register", { method: "POST", body: data });
}

export function login(data: LoginRequest): Promise<AuthUserResponse> {
  return apiRequest("/api/auth/login", { method: "POST", body: data });
}

export function refresh(): Promise<AuthUserResponse> {
  return apiRequest("/api/auth/refresh", { method: "POST" });
}

export function logout(): Promise<{ message: string }> {
  return apiRequest("/api/auth/logout", { method: "POST" });
}

export function me(): Promise<AuthUserResponse> {
  return apiRequest("/api/auth/me");
}