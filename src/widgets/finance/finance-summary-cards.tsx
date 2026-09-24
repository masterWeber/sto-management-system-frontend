"use client";

import { Card, SimpleGrid, Text } from "@mantine/core";
import type { FinanceSummary } from "@/shared/api/types";
import { formatMoney } from "@/shared/lib/money";

export function FinanceSummaryCards({ summary }: { summary: FinanceSummary }) {
  const items = [
    { label: "Выручка", value: formatMoney(summary.revenueKopecks) },
    { label: "Расходы", value: formatMoney(summary.expensesKopecks) },
    { label: "Чистая прибыль", value: formatMoney(summary.netProfitKopecks) },
    { label: "Средний чек", value: formatMoney(summary.averageCheckKopecks) },
    { label: "Клиентов", value: String(summary.clientsCount) },
    { label: "Заказов", value: String(summary.ordersCount) },
  ];

  return (
    <SimpleGrid cols={{ base: 2, sm: 3, lg: 6 }}>
      {items.map((item) => (
        <Card key={item.label} withBorder padding="md" radius="md">
          <Text size="xs" c="dimmed">
            {item.label}
          </Text>
          <Text fw={700} size="lg" mt={4}>
            {item.value}
          </Text>
        </Card>
      ))}
    </SimpleGrid>
  );
}
