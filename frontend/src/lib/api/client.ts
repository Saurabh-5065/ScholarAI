import type { ErrorResponse } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

type JsonBody = object | string | number | boolean | null;

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

function getXsrfToken(): string | undefined {
  if (typeof document === "undefined") return undefined;
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="))
    ?.split("=")[1];
}

async function ensureXsrfToken(): Promise<string | undefined> {
  const existing = getXsrfToken();
  if (existing) return decodeURIComponent(existing);

  await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: "GET",
    credentials: "include",
  }).catch(() => undefined);

  const token = getXsrfToken();
  return token ? decodeURIComponent(token) : undefined;
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
