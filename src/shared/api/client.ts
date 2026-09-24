import { ApiError } from "./api-error";
import type { ApiErrorBody } from "./types";

export const PROXY_PREFIX = "/api/proxy";

export function buildQuery(params?: object): string {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    searchParams.set(key, String(value));
  }
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export function withQuery(path: string, params?: object): string {
  return `${path}${buildQuery(params)}`;
}

async function throwApiError(res: Response): Promise<never> {
  let body: Partial<ApiErrorBody> = {};
  try {
    body = (await res.json()) as Partial<ApiErrorBody>;
  } catch {
    body = {};
  }
  throw ApiError.fromBody(res.status, body);
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${PROXY_PREFIX}${path}`, {
    ...init,
    credentials: "include",
    headers: { "content-type": "application/json", ...(init.headers ?? {}) },
  });

  if (!res.ok) await throwApiError(res);
  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }
  return (await res.blob()) as unknown as T;
}

export async function apiDownload(
  path: string,
  filename: string,
): Promise<void> {
  const res = await fetch(`${PROXY_PREFIX}${path}`, {
    credentials: "include",
  });
  if (!res.ok) await throwApiError(res);

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
