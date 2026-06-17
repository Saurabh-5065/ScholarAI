import { apiRequest } from "./client";
import type {
  CreateProjectRequest,
  PageResponse,
  ProjectResponse,
  UpdateProjectRequest,
} from "./types";

export function createProject(
  data: CreateProjectRequest,
): Promise<ProjectResponse> {
  return apiRequest("/api/projects", { method: "POST", body: data });
}

export function listProjects(
  page = 0,
  size = 20,
): Promise<PageResponse<ProjectResponse>> {
  return apiRequest(`/api/projects?page=${page}&size=${size}`);
}

export function getProject(projectId: string): Promise<ProjectResponse> {
  return apiRequest(`/api/projects/${projectId}`);
}

export function updateProject(
  projectId: string,
  data: UpdateProjectRequest,
): Promise<ProjectResponse> {
  return apiRequest(`/api/projects/${projectId}`, { method: "PUT", body: data });
}

export function deleteProject(projectId: string): Promise<void> {
  return apiRequest(`/api/projects/${projectId}`, { method: "DELETE" });
}
