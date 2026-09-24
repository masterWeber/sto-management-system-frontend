"use client";

import type { ReactNode } from "react";
import { Center, Loader, Text } from "@mantine/core";
import { getErrorMessage } from "@/shared/api/api-error";

export function QueryState({
  isLoading,
  error,
  children,
}: {
  isLoading?: boolean;
  error?: unknown;
  children: ReactNode;
}) {
  if (isLoading) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  if (error) {
    return (
      <Center py="xl">
        <Text c="red">{getErrorMessage(error)}</Text>
      </Center>
    );
  }

  return <>{children}</>;
}
