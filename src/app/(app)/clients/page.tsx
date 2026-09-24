"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ActionIcon,
  Button,
  Group,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEye, IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { zodValidate } from "@/shared/lib/form";
import { z } from "zod";
import {
  useClients,
  useCreateClient,
  useDeleteClient,
  useUpdateClient,
} from "@/entities/client/queries";
import { RequireRole } from "@/features/auth/ui/require-role";
import type { Client, CreateClientInput } from "@/shared/api/types";
import { useListParams } from "@/shared/lib/use-list-params";
import { confirmDelete } from "@/shared/ui/confirm";
import { FormModal } from "@/shared/ui/form-modal";
import { ListPagination } from "@/shared/ui/list-pagination";
import { notifyError, notifySuccess } from "@/shared/ui/notify";
import { PageHeader } from "@/shared/ui/page-header";
import { QueryState } from "@/shared/ui/query-state";
import { SearchInput } from "@/shared/ui/search-input";

const clientSchema = z.object({
  firstName: z.string().min(1, "Укажите имя"),
  lastName: z.string().min(1, "Укажите фамилию"),
  phone: z.string().min(1, "Укажите телефон"),
});

function ClientsContent() {
  const { page, setPage, search, onSearch, searchValue, limit } =
    useListParams();
  const [editing, setEditing] = useState<Client | null>(null);
  const [opened, setOpened] = useState(false);

  const { data, isLoading, error } = useClients({
    page,
    limit,
    search: searchValue,
  });
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();

  const form = useForm<CreateClientInput>({
    validate: zodValidate<CreateClientInput>(clientSchema),
    initialValues: { firstName: "", lastName: "", phone: "" },
  });

  const openCreate = () => {
    setEditing(null);
    form.setValues({ firstName: "", lastName: "", phone: "" });
    form.resetDirty();
    setOpened(true);
  };

  const openEdit = (client: Client) => {
    setEditing(client);
    form.setValues({
      firstName: client.firstName,
      lastName: client.lastName,
      phone: client.phone,
    });
    form.resetDirty();
    setOpened(true);
  };

  const handleSubmit = form.onSubmit((values) => {
    const options = {
      onSuccess: () => {
        notifySuccess(editing ? "Клиент обновлён" : "Клиент добавлен");
        setOpened(false);
      },
      onError: notifyError,
    };
    if (editing) {
      updateClient.mutate({ id: editing.id, input: values }, options);
    } else {
      createClient.mutate(values, options);
    }
  });

  const handleDelete = (client: Client) => {
    confirmDelete(
      `Удалить клиента «${client.lastName} ${client.firstName}»?`,
      () =>
        deleteClient.mutate(client.id, {
          onSuccess: () => notifySuccess("Клиент удалён"),
          onError: notifyError,
        }),
    );
  };

  return (
    <Stack>
      <PageHeader
        title="Клиенты"
        description="База клиентов автосервиса"
        action={
          <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>
            Добавить клиента
          </Button>
        }
      />

      <SearchInput
        value={search}
        onChange={onSearch}
        placeholder="Поиск по ФИО или телефону"
      />

      <QueryState isLoading={isLoading} error={error}>
        {data ? (
          <>
            <Table.ScrollContainer minWidth={640}>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>ФИО</Table.Th>
                    <Table.Th>Телефон</Table.Th>
                    <Table.Th w={140} />
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {data.items.map((client) => (
                    <Table.Tr key={client.id}>
                      <Table.Td>
                        {client.lastName} {client.firstName}
                      </Table.Td>
                      <Table.Td>{client.phone}</Table.Td>
                      <Table.Td>
                        <Group gap="xs" justify="flex-end">
                          <ActionIcon
                            component={Link}
                            href={`/clients/${client.id}`}
                            variant="subtle"
                            aria-label="Открыть"
                          >
                            <IconEye size={16} />
                          </ActionIcon>
                          <ActionIcon
                            variant="subtle"
                            aria-label="Изменить"
                            onClick={() => openEdit(client)}
                          >
                            <IconPencil size={16} />
                          </ActionIcon>
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            aria-label="Удалить"
                            onClick={() => handleDelete(client)}
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
                Клиенты не найдены
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
        title={editing ? "Изменить клиента" : "Новый клиент"}
        onSubmit={handleSubmit}
        submitting={createClient.isPending || updateClient.isPending}
      >
        <TextInput label="Фамилия" {...form.getInputProps("lastName")} />
        <TextInput label="Имя" {...form.getInputProps("firstName")} />
        <TextInput label="Телефон" {...form.getInputProps("phone")} />
      </FormModal>
    </Stack>
  );
}

export default function ClientsPage() {
  return (
    <RequireRole roles={["ADMIN", "MANAGER"]}>
      <ClientsContent />
    </RequireRole>
  );
}
