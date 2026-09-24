"use client";

import { useState } from "react";
import {
  ActionIcon,
  Button,
  Group,
  NumberInput,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { zodValidate } from "@/shared/lib/form";
import { z } from "zod";
import {
  useCars,
  useCreateCar,
  useDeleteCar,
  useUpdateCar,
} from "@/entities/car/queries";
import { useClients } from "@/entities/client/queries";
import { RequireRole } from "@/features/auth/ui/require-role";
import type { Car, CreateCarInput } from "@/shared/api/types";
import { useListParams } from "@/shared/lib/use-list-params";
import { confirmDelete } from "@/shared/ui/confirm";
import { FormModal } from "@/shared/ui/form-modal";
import { ListPagination } from "@/shared/ui/list-pagination";
import { notifyError, notifySuccess } from "@/shared/ui/notify";
import { PageHeader } from "@/shared/ui/page-header";
import { QueryState } from "@/shared/ui/query-state";
import { SearchInput } from "@/shared/ui/search-input";

const carSchema = z.object({
  make: z.string().min(1, "Укажите марку"),
  year: z
    .number({ message: "Укажите год" })
    .min(1900, "Некорректный год")
    .max(2100, "Некорректный год"),
  licensePlate: z.string().min(1, "Укажите госномер"),
  vin: z.string().optional(),
  clientId: z.string().min(1, "Выберите клиента"),
});

function CarsContent() {
  const { page, setPage, search, onSearch, searchValue, limit } =
    useListParams();
  const [editing, setEditing] = useState<Car | null>(null);
  const [opened, setOpened] = useState(false);

  const { data, isLoading, error } = useCars({
    page,
    limit,
    search: searchValue,
  });
  const clients = useClients({ limit: 100 });
  const createCar = useCreateCar();
  const updateCar = useUpdateCar();
  const deleteCar = useDeleteCar();

  const clientOptions =
    clients.data?.items.map((client) => ({
      value: client.id,
      label: `${client.lastName} ${client.firstName}`,
    })) ?? [];

  const clientName = (clientId: string) => {
    const client = clients.data?.items.find((item) => item.id === clientId);
    return client ? `${client.lastName} ${client.firstName}` : "—";
  };

  const form = useForm<CreateCarInput>({
    validate: zodValidate<CreateCarInput>(carSchema),
    initialValues: {
      make: "",
      year: new Date().getFullYear(),
      licensePlate: "",
      vin: "",
      clientId: "",
    },
  });

  const openCreate = () => {
    setEditing(null);
    form.setValues({
      make: "",
      year: new Date().getFullYear(),
      licensePlate: "",
      vin: "",
      clientId: "",
    });
    form.resetDirty();
    setOpened(true);
  };

  const openEdit = (car: Car) => {
    setEditing(car);
    form.setValues({
      make: car.make,
      year: car.year,
      licensePlate: car.licensePlate,
      vin: car.vin ?? "",
      clientId: car.clientId,
    });
    form.resetDirty();
    setOpened(true);
  };

  const handleSubmit = form.onSubmit((values) => {
    const options = {
      onSuccess: () => {
        notifySuccess(editing ? "Автомобиль обновлён" : "Автомобиль добавлен");
        setOpened(false);
      },
      onError: notifyError,
    };
    if (editing) {
      updateCar.mutate(
        {
          id: editing.id,
          input: {
            make: values.make,
            year: values.year,
            licensePlate: values.licensePlate,
            vin: values.vin || undefined,
          },
        },
        options,
      );
    } else {
      createCar.mutate(
        { ...values, vin: values.vin || undefined },
        options,
      );
    }
  });

  const handleDelete = (car: Car) => {
    confirmDelete(
      `Удалить автомобиль «${car.make} ${car.licensePlate}»?`,
      () =>
        deleteCar.mutate(car.id, {
          onSuccess: () => notifySuccess("Автомобиль удалён"),
          onError: notifyError,
        }),
    );
  };

  return (
    <Stack>
      <PageHeader
        title="Автомобили"
        description="Автопарк клиентов"
        action={
          <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>
            Добавить автомобиль
          </Button>
        }
      />

      <SearchInput
        value={search}
        onChange={onSearch}
        placeholder="Поиск по марке или госномеру"
      />

      <QueryState isLoading={isLoading} error={error}>
        {data ? (
          <>
            <Table.ScrollContainer minWidth={800}>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Марка</Table.Th>
                    <Table.Th>Год</Table.Th>
                    <Table.Th>Госномер</Table.Th>
                    <Table.Th>VIN</Table.Th>
                    <Table.Th>Клиент</Table.Th>
                    <Table.Th w={120} />
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {data.items.map((car) => (
                    <Table.Tr key={car.id}>
                      <Table.Td>{car.make}</Table.Td>
                      <Table.Td>{car.year}</Table.Td>
                      <Table.Td>{car.licensePlate}</Table.Td>
                      <Table.Td>{car.vin ?? "—"}</Table.Td>
                      <Table.Td>{clientName(car.clientId)}</Table.Td>
                      <Table.Td>
                        <Group gap="xs" justify="flex-end">
                          <ActionIcon
                            variant="subtle"
                            aria-label="Изменить"
                            onClick={() => openEdit(car)}
                          >
                            <IconPencil size={16} />
                          </ActionIcon>
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            aria-label="Удалить"
                            onClick={() => handleDelete(car)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>

            {data.items.length === 0 ? (
              <Text c="dimmed" ta="center" py="md">
                Автомобили не найдены
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

      <FormModal
        opened={opened}
        onClose={() => setOpened(false)}
        title={editing ? "Изменить автомобиль" : "Новый автомобиль"}
        onSubmit={handleSubmit}
        submitting={createCar.isPending || updateCar.isPending}
      >
        <TextInput label="Марка" {...form.getInputProps("make")} />
        <NumberInput label="Год" {...form.getInputProps("year")} />
        <TextInput
          label="Госномер"
          {...form.getInputProps("licensePlate")}
        />
        <TextInput label="VIN" {...form.getInputProps("vin")} />
        <Select
          label="Клиент"
          data={clientOptions}
          searchable
          disabled={Boolean(editing)}
          {...form.getInputProps("clientId")}
        />
      </FormModal>
    </Stack>
  );
}

export default function CarsPage() {
  return (
    <RequireRole roles={["ADMIN", "MANAGER"]}>
      <CarsContent />
    </RequireRole>
  );
}
