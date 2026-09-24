"use client";

import type { ReactNode } from "react";
import { Center, Loader, Text } from "@mantine/core";
import type { Role } from "@/shared/api/types";
import { useSession } from "../model/use-session";

export function RequireRole({
  roles,
  children,
}: {
  roles: Role[];
  children: ReactNode;
}) {
  const { user, isLoading } = useSession();

  if (isLoading) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  if (!user || !roles.includes(user.role)) {
    return (
      <Center py="xl">
        <Text c="dimmed">Недостаточно прав для просмотра раздела</Text>
      </Center>
    );
  }

  return <>{children}</>;
}
