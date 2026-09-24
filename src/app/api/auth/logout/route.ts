import { NextResponse } from "next/server";
import { env } from "@/shared/config/env";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(env.authCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: env.isProduction,
    path: "/",
    maxAge: 0,
  });
  return response;
}
