"use client";

import Link from "next/link";
import { Badge, Card, Table, Text, Title } from "@mantine/core";
import type { FinanceRecentOrder } from "@/shared/api/types";
import { formatDateTime } from "@/shared/lib/dates";
import { formatMoney } from "@/shared/lib/money";
import {
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
} from "@/shared/lib/order-status";

export function FinanceRecentOrders({
  orders,
}: {
  orders: FinanceRecentOrder[];
}) {
  return (
    <Card withBorder padding="md" radius="md">
      <Title order={4} mb="md">
        Последние заказы
      </Title>
      {orders.length === 0 ? (
        <Text c="dimmed" size="sm">
          Нет заказов за выбранный период
        </Text>
      ) : (
        <Table highlightOnHover verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Дата</Table.Th>
              <Table.Th>Статус</Table.Th>
              <Table.Th ta="right">Сумма</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {orders.map((order) => (
              <Table.Tr key={order.orderId}>
                <Table.Td>
                  <Text
                    component={Link}
                    href={`/orders/${order.orderId}`}
                    size="sm"
                    c="blue"
                  >
                    {formatDateTime(order.scheduledAt)}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Badge color={ORDER_STATUS_COLORS[order.status]} variant="light">
                    {ORDER_STATUS_LABELS[order.status]}
                  </Badge>
                </Table.Td>
                <Table.Td ta="right">
                  {formatMoney(order.totalKopecks)}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </Card>
  );
}
