"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Select,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { IconEye, IconPlus, IconTrash } from "@tabler/icons-react";
import { useCars } from "@/entities/car/queries";
import { useClients } from "@/entities/client/queries";
import { useDeleteOrder, useOrders } from "@/entities/order/queries";
import { useAccess } from "@/features/auth/model/use-access";
import { RequireRole } from "@/features/auth/ui/require-role";
import type { Order, OrderStatus } from "@/shared/api/types";
import { formatDateTime } from "@/shared/lib/dates";
import { formatMoney } from "@/shared/lib/money";
import {
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
} from "@/shared/lib/order-status";
import { useListParams } from "@/shared/lib/use-list-params";
import { confirmDelete } from "@/shared/ui/confirm";
import { ListPagination } from "@/shared/ui/list-pagination";
import { notifyError, notifySuccess } from "@/shared/ui/notify";
import { PageHeader } from "@/shared/ui/page-header";
import { QueryState } from "@/shared/ui/query-state";

const STATUS_OPTIONS = [
  { value: "ALL", label: "Все статусы" },
  ...Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
];

function OrdersContent() {
  const { page, setPage, limit } = useListParams();
  const { hasRole } = useAccess();
  const canManage = hasRole(["ADMIN", "MANAGER"]);
  const [status, setStatus] = useState<string>("ALL");

  const { data, isLoading, error } = useOrders({
    page,
    limit,
    status: status === "ALL" ? undefined : (status as OrderStatus),
  });
  const clients = useClients({ limit: 100 });
  const cars = useCars({ limit: 100 });
  const deleteOrder = useDeleteOrder();

  const clientName = (clientId: string) => {
    const client = clients.data?.items.find((item) => item.id === clientId);
    return client ? `${client.lastName} ${client.firstName}` : "—";
  };

  const carName = (carId: string) => {
    const car = cars.data?.items.find((item) => item.id === carId);
    return car ? `${car.make} · ${car.licensePlate}` : "—";
  };

  const handleDelete = (order: Order) => {
    confirmDelete(`Удалить заказ-наряд от ${formatDateTime(order.scheduledAt)}?`, () =>
      deleteOrder.mutate(order.id, {
        onSuccess: () => notifySuccess("Заказ-наряд удалён"),
        onError: notifyError,
      }),
    );
  };

  return (
    <Stack>
      <PageHeader
        title="Заказ-наряды"
        description="Заявки на обслуживание"
        action={
          canManage ? (
            <Button
              component={Link}
              href="/orders/new"
              leftSection={<IconPlus size={16} />}
            >
              Новый заказ
            </Button>
          ) : undefined
        }
      />

      <Group>
        <Select
          data={STATUS_OPTIONS}
          value={status}
          onChange={(value) => {
            setStatus(value ?? "ALL");
            setPage(1);
          }}
          w={200}
        />
      </Group>

      <QueryState isLoading={isLoading} error={error}>
        {data ? (
          <>
            <Table.ScrollContainer minWidth={900}>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Дата</Table.Th>
                    <Table.Th>Клиент</Table.Th>
                    <Table.Th>Автомобиль</Table.Th>
                    <Table.Th>Статус</Table.Th>
                    <Table.Th ta="right">Сумма</Table.Th>
                    <Table.Th w={120} />
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {data.items.map((order) => (
                    <Table.Tr key={order.id}>
                      <Table.Td>{formatDateTime(order.scheduledAt)}</Table.Td>
                      <Table.Td>{clientName(order.clientId)}</Table.Td>
                      <Table.Td>{carName(order.carId)}</Table.Td>
                      <Table.Td>
                        <Badge color={ORDER_STATUS_COLORS[order.status]} variant="light">
                          {ORDER_STATUS_LABELS[order.status]}
                        </Badge>
                      </Table.Td>
                      <Table.Td ta="right">
                        {formatMoney(order.totalKopecks)}
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs" justify="flex-end">
                          <ActionIcon
                            component={Link}
                            href={`/orders/${order.id}`}
                            variant="subtle"
                            aria-label="Открыть"
                          >
                            <IconEye size={16} />
                          </ActionIcon>
                          {canManage ? (
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              aria-label="Удалить"
                              onClick={() => handleDelete(order)}
                            >
                              <IconTrash size={16} />
                            </ActionIcon>
                          ) : null}
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>

            {data.items.length === 0 ? (
              <Text c="dimmed" ta="center" py="md">
                Заказ-наряды не найдены
              </Text>
            ) : null}

            <ListPagination
              page={page}
              limit={limit}
              total={data.total}
              onPageChange={setPage}
            />
          </>
        ) : null}
      </QueryState>
    </Stack>
  );
}

export default function OrdersPage() {
  return (
    <RequireRole roles={["ADMIN", "MANAGER", "MASTER"]}>
      <OrdersContent />
    </RequireRole>
  );
}
