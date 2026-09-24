export const env = {
  backendUrl: process.env.BACKEND_URL ?? "http://localhost:8080",
  authCookieName: "access_token",
  authCookieMaxAge: Number(process.env.AUTH_COOKIE_MAX_AGE ?? 43200),
  isProduction: process.env.NODE_ENV === "production",
} as const;
