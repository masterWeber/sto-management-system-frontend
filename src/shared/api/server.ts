import { cookies } from "next/headers";
import { env } from "../config/env";

export async function getAuthToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(env.authCookieName)?.value;
}

export function backendUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${env.backendUrl}${normalized}`;
}
