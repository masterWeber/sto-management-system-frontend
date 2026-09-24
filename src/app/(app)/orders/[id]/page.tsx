"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ActionIcon,
  Anchor,
  Badge,
  Button,
  Card,
  Checkbox,
  Divider,
  Group,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";
import {
  IconArrowLeft,
  IconDownload,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useCars } from "@/entities/car/queries";
import { useClients } from "@/entities/client/queries";
import {
  useAddOrderItem,
  useChangeOrderStatus,
  useOrder,
  useRemoveOrderItem,
  useUpdateOrder,
} from "@/entities/order/queries";
import { useServices } from "@/entities/service/queries";
import { useStaffList } from "@/entities/staff/queries";
import { RequireRole } from "@/features/auth/ui/require-role";
import { useAccess } from "@/features/auth/model/use-access";
import { apiDownload } from "@/shared/api/client";
import { orderApi } from "@/entities/order/api";
import type { AddOrderItemInput } from "@/shared/api/types";
import { formatDate, formatDateTime } from "@/shared/lib/dates";
import { formatMoney, rublesToKopecks } from "@/shared/lib/money";
import {
  ORDER_STATUS_COLORS,
  ORDER_STATUS_FLOW,
  ORDER_STATUS_LABELS,
} from "@/shared/lib/order-status";
import { ROLE_LABELS } from "@/shared/config/roles";
import { FormModal } from "@/shared/ui/form-modal";
import { notifyError, notifySuccess } from "@/shared/ui/notify";
import { PageHeader } from "@/shared/ui/page-header";
import { QueryState } from "@/shared/ui/query-state";

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <Text size="xs" c="dimmed">
        {label}
      </Text>
      <Text size="sm">{value}</Text>
    </div>
  );
}

function OrderDetailContent() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { hasRole } = useAccess();

  const order = useOrder(id);
  const clients = useClients({ limit: 100 });
  const cars = useCars({ limit: 100 });
  const staff = useStaffList({ limit: 100 });
  const services = useServices({ limit: 100 });

  const changeStatus = useChangeOrderStatus();
  const addItem = useAddOrderItem();
  const removeItem = useRemoveOrderItem();
  const updateOrder = useUpdateOrder();

  const [itemOpened, setItemOpened] = useState(false);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [customName, setCustomName] = useState("");
  const [customPrice, setCustomPrice] = useState<number | string>(0);
  const [adminOverride, setAdminOverride] = useState(false);
  const [editOpened, setEditOpened] = useState(false);

  const editForm = useForm<{
    scheduledAt: string | null;
    comment: string;
    assignedMasterId: string;
  }>({
    initialValues: { scheduledAt: null, comment: "", assignedMasterId: "" },
  });

  const client = clients.data?.items.find(
    (item) => item.id === order.data?.clientId,
  );
  const car = cars.data?.items.find((item) => item.id === order.data?.carId);
  const master = staff.data?.items.find(
    (item) => item.id === order.data?.assignedMasterId,
  );

  const masterOptions =
    staff.data?.items.map((item) => ({
      value: item.id,
      label: `${item.fullName} · ${ROLE_LABELS[item.role]}`,
    })) ?? [];
  const serviceOptions =
    services.data?.items.map((item) => ({
      value: item.id,
      label: `${item.name} — ${formatMoney(item.priceKopecks)}`,
    })) ?? [];

  const currentIndex = order.data
    ? ORDER_STATUS_FLOW.indexOf(order.data.status)
    : -1;
  const nextStatus =
    currentIndex >= 0 && currentIndex < ORDER_STATUS_FLOW.length - 1
      ? ORDER_STATUS_FLOW[currentIndex + 1]
      : null;

  const handleAddItem = () => {
    const input: AddOrderItemInput = serviceId
      ? { serviceId }
      : {
          name: customName.trim(),
          priceKopecks: rublesToKopecks(Number(customPrice) || 0),
        };
    if (!serviceId && !input.name) {
      notifyError(new Error("Укажите услугу или название позиции"));
      return;
    }
    addItem.mutate(
      { id, input },
      {
        onSuccess: () => {
          notifySuccess("Позиция добавлена");
          setItemOpened(false);
          setServiceId(null);
          setCustomName("");
          setCustomPrice(0);
        },
        onError: notifyError,
      },
    );
  };

  const openEdit = () => {
    if (!order.data) return;
    editForm.setValues({
      scheduledAt: order.data.scheduledAt
        ? dayjs(order.data.scheduledAt).format("YYYY-MM-DD HH:mm:ss")
        : null,
      comment: order.data.comment ?? "",
      assignedMasterId: order.data.assignedMasterId ?? "",
    });
    setEditOpened(true);
  };

  const handleEdit = editForm.onSubmit((values) => {
    if (!values.scheduledAt) return;
    updateOrder.mutate(
      {
        id,
        input: {
          scheduledAt: dayjs(values.scheduledAt).toISOString(),
          comment: values.comment || undefined,
          assignedMasterId: values.assignedMasterId || null,
        },
      },
      {
        onSuccess: () => {
          notifySuccess("Заказ-наряд обновлён");
          setEditOpened(false);
        },
        onError: notifyError,
      },
    );
  });

  const download = async (path: string, filename: string) => {
    try {
      await apiDownload(path, filename);
    } catch (downloadError) {
      notifyError(downloadError);
    }
  };

  return (
    <Stack>
      <Anchor component={Link} href="/orders" size="sm">
        <Group gap={4}>
          <IconArrowLeft size={14} /> К списку заказов
        </Group>
      </Anchor>

      <QueryState isLoading={order.isLoading} error={order.error}>
        {order.data ? (
          <>
            <PageHeader
              title={`Заказ-наряд №${order.data.id.slice(0, 8)}`}
              description={formatDateTime(order.data.scheduledAt)}
              action={
                <Group>
                  <Button variant="default" onClick={openEdit}>
                    Изменить
                  </Button>
                  <Button
                    variant="default"
                    leftSection={<IconDownload size={16} />}
                    onClick={() =>
                      download(
                        orderApi.contractPath(id),
                        `contract-${id.slice(0, 8)}.pdf`,
                      )
                    }
                  >
                    Договор
                  </Button>
                  <Button
                    leftSection={<IconDownload size={16} />}
                    onClick={() =>
                      download(
                        orderApi.actPath(id),
                        `act-${id.slice(0, 8)}.pdf`,
                      )
                    }
                  >
                    Акт
                  </Button>
                </Group>
              }
            />

            <Card withBorder padding="lg">
              <Group justify="space-between" mb="md">
                <Badge
                  color={ORDER_STATUS_COLORS[order.data.status]}
                  size="lg"
                  variant="light"
                >
                  {ORDER_STATUS_LABELS[order.data.status]}
                </Badge>
                {nextStatus ? (
                  <Group>
                    {hasRole(["ADMIN"]) ? (
                      <Checkbox
                        label="Принудительно"
                        checked={adminOverride}
                        onChange={(event) =>
                          setAdminOverride(event.currentTarget.checked)
                        }
                      />
                    ) : null}
                    <Button
                      loading={changeStatus.isPending}
                      onClick={() =>
                        changeStatus.mutate(
                          {
                            id,
                            input: {
                              status: nextStatus,
                              adminOverride: adminOverride || undefined,
                            },
                          },
                          {
                            onSuccess: () =>
                              notifySuccess("Статус обновлён"),
                            onError: notifyError,
                          },
                        )
                      }
                    >
                      Перевести в «{ORDER_STATUS_LABELS[nextStatus]}»
                    </Button>
                  </Group>
                ) : null}
              </Group>

              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
                <InfoRow
                  label="Клиент"
                  value={
                    client ? (
                      <Anchor
                        component={Link}
                        href={`/clients/${client.id}`}
                        size="sm"
                      >
                        {client.lastName} {client.firstName}
                      </Anchor>
                    ) : (
                      "—"
                    )
                  }
                />
                <InfoRow
                  label="Автомобиль"
                  value={car ? `${car.make} · ${car.licensePlate}` : "—"}
                />
                <InfoRow
                  label="Мастер"
                  value={master ? master.fullName : "Не назначен"}
                />
                <InfoRow
                  label="Создан"
                  value={formatDateTime(order.data.scheduledAt)}
                />
                <InfoRow
                  label="Завершён"
                  value={
                    order.data.completedAt
                      ? formatDate(order.data.completedAt)
                      : "—"
                  }
                />
                <InfoRow
                  label="Оплачен"
                  value={
                    order.data.paidAt ? formatDate(order.data.paidAt) : "—"
                  }
                />
              </SimpleGrid>

              {order.data.comment ? (
                <>
                  <Divider my="md" />
                  <InfoRow label="Комментарий" value={order.data.comment} />
                </>
              ) : null}
            </Card>

            <Card withBorder padding="lg">
              <Group justify="space-between" mb="md">
                <Title order={4}>Работы и запчасти</Title>
                <Button
                  leftSection={<IconPlus size={16} />}
                  variant="light"
                  onClick={() => setItemOpened(true)}
                >
                  Добавить позицию
                </Button>
              </Group>

              {order.data.items.length === 0 ? (
                <Text c="dimmed">Позиции не добавлены</Text>
              ) : (
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Наименование</Table.Th>
                      <Table.Th ta="right">Цена</Table.Th>
                      <Table.Th w={60} />
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {order.data.items.map((item) => (
                      <Table.Tr key={item.id}>
                        <Table.Td>{item.name}</Table.Td>
                        <Table.Td ta="right">
                          {formatMoney(item.priceKopecks)}
                        </Table.Td>
                        <Table.Td>
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            aria-label="Удалить позицию"
                            onClick={() =>
                              removeItem.mutate(
                                { id, itemId: item.id },
                                {
                                  onSuccess: () =>
                                    notifySuccess("Позиция удалена"),
                                  onError: notifyError,
                                },
                              )
                            }
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                    <Table.Tr>
                      <Table.Td>
                        <Text fw={700}>Итого</Text>
                      </Table.Td>
                      <Table.Td ta="right">
                        <Text fw={700}>
                          {formatMoney(order.data.totalKopecks)}
                        </Text>
                      </Table.Td>
                      <Table.Td />
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              )}
            </Card>
          </>
        ) : null}
      </QueryState>

      <FormModal
        opened={itemOpened}
        onClose={() => setItemOpened(false)}
        title="Добавить позицию"
        onSubmit={(event) => {
          event.preventDefault();
          handleAddItem();
        }}
        submitting={addItem.isPending}
      >
        <Select
          label="Услуга из прайс-листа"
          placeholder="Выберите услугу"
          data={serviceOptions}
          searchable
          clearable
          value={serviceId}
          onChange={setServiceId}
        />
        {!serviceId ? (
          <>
            <Text size="sm" c="dimmed">
              или укажите позицию вручную
            </Text>
            <TextInput
              label="Наименование"
              value={customName}
              onChange={(event) => setCustomName(event.currentTarget.value)}
            />
            <NumberInput
              label="Цена, ₽"
              min={0}
              decimalScale={2}
              value={customPrice}
              onChange={setCustomPrice}
            />
          </>
        ) : null}
      </FormModal>

      <FormModal
        opened={editOpened}
        onClose={() => setEditOpened(false)}
        title="Изменить заказ-наряд"
        onSubmit={handleEdit}
        submitting={updateOrder.isPending}
      >
        <DateTimePicker
          label="Дата и время"
          valueFormat="DD.MM.YYYY HH:mm"
          {...editForm.getInputProps("scheduledAt")}
        />
        <Select
          label="Мастер"
          placeholder="Не назначен"
          data={masterOptions}
          searchable
          clearable
          {...editForm.getInputProps("assignedMasterId")}
        />
        <Textarea
          label="Комментарий"
          autosize
          minRows={2}
          {...editForm.getInputProps("comment")}
        />
      </FormModal>
    </Stack>
  );
}

export default function OrderDetailPage() {
  return (
    <RequireRole roles={["ADMIN", "MANAGER", "MASTER"]}>
      <OrderDetailContent />
    </RequireRole>
  );
}
