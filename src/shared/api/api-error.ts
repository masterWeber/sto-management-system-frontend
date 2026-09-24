import type { ApiErrorBody, ApiErrorCode } from "./types";

export type AppErrorCode = ApiErrorCode | "NETWORK_ERROR";

export class ApiError extends Error {
  readonly status: number;
  readonly code: AppErrorCode;
  readonly details: string[];

  constructor(
    status: number,
    code: AppErrorCode,
    message: string,
    details: string[] = [],
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }

  static fromBody(status: number, body: Partial<ApiErrorBody>): ApiError {
    const raw = body.message;
    const details = Array.isArray(raw) ? raw : raw ? [raw] : [];
    const message = details[0] ?? "Неизвестная ошибка";
    return new ApiError(
      status,
      body.error ?? "INTERNAL_SERVER_ERROR",
      message,
      details,
    );
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isForbidden(): boolean {
    return this.status === 403;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Произошла непредвиденная ошибка";
}
