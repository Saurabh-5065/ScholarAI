import { apiRequest } from "./client";
import type { WritingGenericResponse, WritingImproveRequest } from "./types";

function postWriting(
  path: string,
  data: WritingImproveRequest,
): Promise<WritingGenericResponse> {
  return apiRequest(`/api/ai/writing/${path}`, { method: "POST", body: data });
}

export function improveWriting(
  data: WritingImproveRequest,
): Promise<WritingGenericResponse> {
  return postWriting("improve", data);
}

export function generateOutline(
  data: WritingImproveRequest,
): Promise<WritingGenericResponse> {
  return postWriting("outline", data);
}

export function generateAbstract(
  data: WritingImproveRequest,
): Promise<WritingGenericResponse> {
  return postWriting("abstract", data);
}

export function summarize(
  data: WritingImproveRequest,
): Promise<WritingGenericResponse> {
  return postWriting("summarize", data);
}

export function extractPaperInsights(
  data: WritingImproveRequest,
): Promise<WritingGenericResponse> {
  return postWriting("extract-paper-insights", data);
}

export function formatCitation(
  data: WritingImproveRequest,
): Promise<WritingGenericResponse> {
  return postWriting("citation-format", data);
}
