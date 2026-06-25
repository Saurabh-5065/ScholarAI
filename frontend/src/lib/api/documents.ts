import { apiRequest } from "./client";
import type { DocumentResponse, PageResponse } from "./types";

export function uploadDocument(
  projectId: string,
  file: File,
): Promise<DocumentResponse> {
  const form = new FormData();
  form.append("file", file);
  return apiRequest(`/api/projects/${projectId}/documents`, {
    method: "POST",
    body: form,
  });
}

export function listDocuments(
  projectId: string,
  page = 0,
  size = 20,
): Promise<PageResponse<DocumentResponse>> {
  return apiRequest(
    `/api/projects/${projectId}/documents?page=${page}&size=${size}`,
  );
}

export function getDocument(
  projectId: string,
  documentId: string,
): Promise<DocumentResponse> {
  return apiRequest(`/api/projects/${projectId}/documents/${documentId}`);
}

export function deleteDocument(
  projectId: string,
  documentId: string,
): Promise<void> {
  return apiRequest(`/api/projects/${projectId}/documents/${documentId}`, {
    method: "DELETE",
  });
}

export function reprocessDocument(
  projectId: string,
  documentId: string,
): Promise<DocumentResponse> {
  return apiRequest(
    `/api/projects/${projectId}/documents/${documentId}/reprocess`,
    { method: "POST" },
  );
}
