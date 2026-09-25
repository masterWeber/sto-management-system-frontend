"use client";

import { useRouter } from "next/navigation";
import { Button, Select, Stack, Textarea } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";
import { zodValidate } from "@/shared/lib/form";
import { z } from "zod";
import { useCars } from "@/entities/car/queries";
import { useClients } from "@/entities/client/queries";
import { useCreateOrder } from "@/entities/order/queries";
import { RequireRole } from "@/features/auth/ui/require-role";
import { notifyError } from "@/shared/ui/notify";
import { PageHeader } from "@/shared/ui/page-header";

const orderSchema = z.object({
  clientId: z.string().min(1, "Выберите клиента"),
  carId: z.string().min(1, "Выберите автомобиль"),
  scheduledAt: z.string().min(1, "Укажите дату и время"),
  comment: z.string().optional(),
});

interface OrderFormValues {
  clientId: string;
  carId: string;
  scheduledAt: string | null;
  comment: string;
}

function NewOrderContent() {
  const router = useRouter();
  const clients = useClients({ limit: 100 });
  const createOrder = useCreateOrder();

  const form = useForm<OrderFormValues>({
    validate: zodValidate<OrderFormValues>(orderSchema),
    initialValues: {
      clientId: "",
      carId: "",
      scheduledAt: null,
      comment: "",
    },
  });

  const cars = useCars({
    clientId: form.values.clientId || undefined,
    limit: 100,
  });

  const clientOptions =
    clients.data?.items.map((client) => ({
      value: client.id,
      label: `${client.lastName} ${client.firstName} (${client.phone})`,
    })) ?? [];

  const carOptions =
    cars.data?.items.map((car) => ({
      value: car.id,
      label: `${car.make} · ${car.licensePlate}`,
    })) ?? [];

  const handleSubmit = form.onSubmit((values) => {
    if (!values.scheduledAt) return;
    createOrder.mutate(
      {
        clientId: values.clientId,
        carId: values.carId,
        scheduledAt: dayjs(values.scheduledAt).toISOString(),
        comment: values.comment || undefined,
      },
      {
        onSuccess: (order) => router.push(`/orders/${order.id}`),
        onError: notifyError,
      },
    );
  });

  return (
    <Stack maw={560}>
      <PageHeader
        title="Новый заказ-наряд"
        description="Оформление заявки на обслуживание"
      />

      <form onSubmit={handleSubmit}>
        <Stack>
          <Select
            label="Клиент"
            placeholder="Выберите клиента"
            data={clientOptions}
            searchable
            {...form.getInputProps("clientId")}
            onChange={(value) => {
              form.setFieldValue("clientId", value ?? "");
              form.setFieldValue("carId", "");
            }}
          />
          <Select
            label="Автомобиль"
            placeholder={
              form.values.clientId
                ? "Выберите автомобиль"
                : "Сначала выберите клиента"
            }
            data={carOptions}
            searchable
            disabled={!form.values.clientId}
            {...form.getInputProps("carId")}
          />
          <DateTimePicker
            label="Дата и время"
            placeholder="Выберите дату и время"
            valueFormat="DD.MM.YYYY HH:mm"
            {...form.getInputProps("scheduledAt")}
          />
          <Textarea
            label="Комментарий"
            autosize
            minRows={2}
            {...form.getInputProps("comment")}
          />
          <Button type="submit" loading={createOrder.isPending}>
            Создать заказ
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}

export default function NewOrderPage() {
  return (
    <RequireRole roles={["ADMIN", "MANAGER"]}>
      <NewOrderContent />
    </RequireRole>
  );
}
