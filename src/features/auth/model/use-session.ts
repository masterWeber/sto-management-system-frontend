"use client";

import { useMe } from "@/entities/staff/queries";
import type { Role } from "@/shared/api/types";

export function useSession() {
  const query = useMe();
  return {
    user: query.data,
    role: query.data?.role,
    isLoading: query.isLoading,
    isError: query.isError,
    isAuthenticated: Boolean(query.data),
  };
}

export function useRole(): Role | undefined {
  return useSession().role;
}
