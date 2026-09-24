import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/shared/config/env";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(env.authCookieName)?.value;
  const { pathname } = request.nextUrl;
  const isAuthPage = pathname === "/login";

  if (!token && !isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    if (pathname !== "/") url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (token && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)"],
};
