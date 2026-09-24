"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Anchor,
  Badge,
  Card,
  Group,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useCars } from "@/entities/car/queries";
import { useClient } from "@/entities/client/queries";
import { useOrders } from "@/entities/order/queries";
import { RequireRole } from "@/features/auth/ui/require-role";
import { formatDate } from "@/shared/lib/dates";
import { formatMoney } from "@/shared/lib/money";
import {
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
} from "@/shared/lib/order-status";
import { PageHeader } from "@/shared/ui/page-header";
import { QueryState } from "@/shared/ui/query-state";

function ClientDetailContent() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const client = useClient(id);
  const cars = useCars({ clientId: id, limit: 100 });
  const orders = useOrders({ clientId: id, limit: 100 });

  return (
    <Stack>
      <Anchor component={Link} href="/clients" size="sm">
        <Group gap={4}>
          <IconArrowLeft size={14} /> К списку клиентов
        </Group>
      </Anchor>

      <QueryState isLoading={client.isLoading} error={client.error}>
        {client.data ? (
          <>
            <PageHeader
              title={`${client.data.lastName} ${client.data.firstName}`}
              description={client.data.phone}
            />

            <Card withBorder padding="lg">
              <Title order={4} mb="sm">
                Автомобили
              </Title>
              <QueryState isLoading={cars.isLoading} error={cars.error}>
                {cars.data && cars.data.items.length > 0 ? (
                  <Table striped>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Марка</Table.Th>
                        <Table.Th>Год</Table.Th>
                        <Table.Th>Госномер</Table.Th>
                        <Table.Th>VIN</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {cars.data.items.map((car) => (
                        <Table.Tr key={car.id}>
                          <Table.Td>{car.make}</Table.Td>
                          <Table.Td>{car.year}</Table.Td>
                          <Table.Td>{car.licensePlate}</Table.Td>
                          <Table.Td>{car.vin ?? "—"}</Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                ) : (
                  <Text c="dimmed">Автомобилей нет</Text>
                )}
              </QueryState>
            </Card>

            <Card withBorder padding="lg">
              <Title order={4} mb="sm">
                Заказ-наряды
              </Title>
              <QueryState isLoading={orders.isLoading} error={orders.error}>
                {orders.data && orders.data.items.length > 0 ? (
                  <Table striped>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Дата</Table.Th>
                        <Table.Th>Статус</Table.Th>
                        <Table.Th>Сумма</Table.Th>
                        <Table.Th />
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {orders.data.items.map((order) => (
                        <Table.Tr key={order.id}>
                          <Table.Td>{formatDate(order.scheduledAt)}</Table.Td>
                          <Table.Td>
                            <Badge color={ORDER_STATUS_COLORS[order.status]}>
                              {ORDER_STATUS_LABELS[order.status]}
                            </Badge>
                          </Table.Td>
                          <Table.Td>{formatMoney(order.totalKopecks)}</Table.Td>
                          <Table.Td>
                            <Anchor
                              component={Link}
                              href={`/orders/${order.id}`}
                              size="sm"
                            >
                              Открыть
                            </Anchor>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                ) : (
                  <Text c="dimmed">Заказ-нарядов нет</Text>
                )}
              </QueryState>
            </Card>
          </>
        ) : null}
      </QueryState>
    </Stack>
  );
}

export default function ClientDetailPage() {
  return (
    <RequireRole roles={["ADMIN", "MANAGER"]}>
      <ClientDetailContent />
    </RequireRole>
  );
}
