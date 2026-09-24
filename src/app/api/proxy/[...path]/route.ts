import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/shared/config/env";
import { backendUrl, getAuthToken } from "@/shared/api/server";

const FORWARDED_REQUEST_HEADERS = ["content-type", "accept"];
const FORWARDED_RESPONSE_HEADERS = ["content-type", "content-disposition"];

async function proxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const token = await getAuthToken();
  const target = backendUrl(`${path.join("/")}${request.nextUrl.search}`);

  const headers = new Headers();
  for (const name of FORWARDED_REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  if (token) headers.set("authorization", `Bearer ${token}`);

  const hasBody = !["GET", "HEAD"].includes(request.method);
  const body = hasBody ? await request.arrayBuffer() : undefined;

  const backendResponse = await fetch(target, {
    method: request.method,
    headers,
    body,
    cache: "no-store",
  });

  const responseHeaders = new Headers();
  for (const name of FORWARDED_RESPONSE_HEADERS) {
    const value = backendResponse.headers.get(name);
    if (value) responseHeaders.set(name, value);
  }

  const response = new NextResponse(backendResponse.body, {
    status: backendResponse.status,
    headers: responseHeaders,
  });

  if (backendResponse.status === 401) {
    response.cookies.set(env.authCookieName, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: env.isProduction,
      path: "/",
      maxAge: 0,
    });
  }

  return response;
}

export {
  proxy as GET,
  proxy as POST,
  proxy as PATCH,
  proxy as PUT,
  proxy as DELETE,
};
