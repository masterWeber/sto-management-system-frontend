"use client";

import type { Role } from "@/shared/api/types";
import { canAccess, hasRole, type Section } from "@/shared/config/roles";
import { useSession } from "./use-session";

export function useAccess() {
  const { role, isLoading } = useSession();

  return {
    role,
    isLoading,
    can: (section: Section) => canAccess(role, section),
    hasRole: (roles: Role[]) => hasRole(role, roles),
  };
}
