import { NextResponse } from "next/server";
import { env } from "@/shared/config/env";
import { backendUrl } from "@/shared/api/server";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  if (!payload) {
    return NextResponse.json(
      {
        statusCode: 400,
        error: "VALIDATION_ERROR",
        message: "Некорректный запрос",
      },
      { status: 400 },
    );
  }

  const backendResponse = await fetch(backendUrl("/auth/login"), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = (await backendResponse.json().catch(() => ({}))) as {
    accessToken?: string;
  };

  if (!backendResponse.ok || !data.accessToken) {
    return NextResponse.json(data, { status: backendResponse.status || 400 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(env.authCookieName, data.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.isProduction,
    path: "/",
    maxAge: env.authCookieMaxAge,
  });
  return response;
}
