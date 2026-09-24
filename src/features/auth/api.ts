import { ApiError } from "@/shared/api/api-error";
import type { ApiErrorBody, LoginInput } from "@/shared/api/types";

async function parseError(res: Response): Promise<never> {
  let body: Partial<ApiErrorBody> = {};
  try {
    body = (await res.json()) as Partial<ApiErrorBody>;
  } catch {
    body = {};
  }
  throw ApiError.fromBody(res.status, body);
}

export async function login(input: LoginInput): Promise<void> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
    credentials: "include",
  });
  if (!res.ok) await parseError(res);
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}
