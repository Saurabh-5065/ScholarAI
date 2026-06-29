import type { ErrorResponse } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

type JsonBody = object | string | number | boolean | null;

let csrfToken: string | undefined;

export class ApiError extends Error {
  status: number;
  error: string;
  path?: string;

  constructor(response: ErrorResponse | { message: string }, status: number) {
    super(response.message);
    this.name = "ApiError";
    this.status = status;
    this.error = "error" in response ? response.error : "API_ERROR";
    this.path = "path" in response ? response.path : undefined;
  }
}

async function ensureXsrfToken(): Promise<string | undefined> {
  if (csrfToken) return csrfToken;

  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: "GET",
    credentials: "include",
  }).catch(() => undefined);

  if (response) {
    const token = response.headers.get("X-XSRF-TOKEN");
    if (token) csrfToken = token;
  }

  return csrfToken;
}

type ApiOptions = Omit<RequestInit, "body"> & {
  body?: JsonBody | FormData;
};

export async function apiRequest<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const method = (options.method ?? "GET").toUpperCase();
  const headers = new Headers(options.headers);
  const body = options.body;

  let requestBody: BodyInit | undefined;
  if (body instanceof FormData) {
    requestBody = body;
  } else if (body !== undefined) {
    headers.set("Content-Type", "application/json");
    requestBody = JSON.stringify(body);
  }

  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const token = await ensureXsrfToken();
    if (token) headers.set("X-XSRF-TOKEN", token);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    method,
    headers,
    body: requestBody,
    credentials: "include",
    // Never let the browser serve an authenticated response (e.g. /api/auth/me)
    // from its HTTP cache. The session must always be validated against the server.
    cache: "no-store",
  });

  // Capture refreshed CSRF token if backend rotates it
  const newToken = response.headers.get("X-XSRF-TOKEN");
  if (newToken) csrfToken = newToken;

  if (response.status === 204) return undefined as T;

  const contentType = response.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new ApiError(
      data && typeof data.message === "string"
        ? (data as ErrorResponse)
        : { message: "Request failed" },
      response.status,
    );
  }

  return data as T;
}
