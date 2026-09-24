"use client";

import { Group, Pagination, Text } from "@mantine/core";

export function ListPagination({
  page,
  limit,
  total,
  onPageChange,
}: {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <Group justify="space-between" mt="md">
      <Text size="sm" c="dimmed">
        Всего: {total}
      </Text>
      {totalPages > 1 ? (
        <Pagination value={page} onChange={onPageChange} total={totalPages} />
      ) : null}
    </Group>
  );
}
