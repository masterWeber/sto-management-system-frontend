"use client";

import { useState } from "react";
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  PasswordInput,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPencil, IconPlus, IconUserOff } from "@tabler/icons-react";
import { zodValidate } from "@/shared/lib/form";
import { z } from "zod";
import {
  useCreateStaff,
  useDeactivateStaff,
  useStaffList,
  useUpdateStaff,
} from "@/entities/staff/queries";
import { RequireRole } from "@/features/auth/ui/require-role";
import type { Role, Staff } from "@/shared/api/types";
import { ROLE_LABELS } from "@/shared/config/roles";
import { useListParams } from "@/shared/lib/use-list-params";
import { confirmDelete } from "@/shared/ui/confirm";
import { FormModal } from "@/shared/ui/form-modal";
import { ListPagination } from "@/shared/ui/list-pagination";
import { notifyError, notifySuccess } from "@/shared/ui/notify";
import { PageHeader } from "@/shared/ui/page-header";
import { QueryState } from "@/shared/ui/query-state";

const ROLE_OPTIONS = Object.entries(ROLE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const staffSchema = z.object({
  fullName: z.string().min(1, "Укажите ФИО"),
  login: z.string().min(1, "Укажите логин"),
  password: z.string().min(6, "Минимум 6 символов"),
  role: z.enum(["ADMIN", "MANAGER", "MASTER"], {
    message: "Выберите роль",
  }),
});

interface StaffFormValues {
  fullName: string;
  login: string;
  password: string;
  role: Role;
}

function StaffContent() {
  const { page, setPage, limit } = useListParams();
  const [opened, setOpened] = useState(false);
  const [editing, setEditing] = useState<Staff | null>(null);

  const { data, isLoading, error } = useStaffList({ page, limit });
  const createStaff = useCreateStaff();
  const updateStaff = useUpdateStaff();
  const deactivateStaff = useDeactivateStaff();

  const form = useForm<StaffFormValues>({
    validate: zodValidate<StaffFormValues>(staffSchema),
    initialValues: { fullName: "", login: "", password: "", role: "MASTER" },
  });

  const openCreate = () => {
    setEditing(null);
    form.setValues({
      fullName: "",
      login: "",
      password: "",
      role: "MASTER",
    });
    setOpened(true);
  };

  const openEdit = (staff: Staff) => {
    setEditing(staff);
    form.setValues({
      fullName: staff.fullName,
      login: staff.login,
      password: "",
      role: staff.role,
    });
    setOpened(true);
  };

  const handleSubmit = form.onSubmit((values) => {
    const options = {
      onSuccess: () => {
        notifySuccess(editing ? "Сотрудник обновлён" : "Сотрудник добавлен");
        setOpened(false);
      },
      onError: notifyError,
    };
    if (editing) {
      updateStaff.mutate(
        {
          id: editing.id,
          input: { fullName: values.fullName, role: values.role },
        },
        options,
      );
    } else {
      createStaff.mutate(
        {
          fullName: values.fullName,
          login: values.login,
          password: values.password,
          role: values.role,
        },
        options,
      );
    }
  });

  return (
    <Stack>
      <PageHeader
        title="Сотрудники"
        description="Пользователи системы"
        action={
          <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>
            Добавить сотрудника
          </Button>
        }
      />

      <QueryState isLoading={isLoading} error={error}>
        {data ? (
          <>
            <Table.ScrollContainer minWidth={720}>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>ФИО</Table.Th>
                    <Table.Th>Логин</Table.Th>
                    <Table.Th>Роль</Table.Th>
                    <Table.Th>Статус</Table.Th>
                    <Table.Th w={120} />
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {data.items.map((staff) => (
                    <Table.Tr key={staff.id}>
                      <Table.Td>{staff.fullName}</Table.Td>
                      <Table.Td>{staff.login}</Table.Td>
                      <Table.Td>
                        <Badge variant="light">
                          {ROLE_LABELS[staff.role]}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          color={staff.isActive ? "green" : "gray"}
                          variant="light"
                        >
                          {staff.isActive ? "Активен" : "Отключён"}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs" justify="flex-end">
                          <ActionIcon
                            variant="subtle"
                            aria-label="Изменить"
                            onClick={() => openEdit(staff)}
                          >
                            <IconPencil size={16} />
                          </ActionIcon>
                          {staff.isActive ? (
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              aria-label="Отключить"
                              onClick={() =>
                                confirmDelete(
                                  `Отключить сотрудника «${staff.fullName}»?`,
                                  () =>
                                    deactivateStaff.mutate(staff.id, {
                                      onSuccess: () =>
                                        notifySuccess("Сотрудник отключён"),
                                      onError: notifyError,
                                    }),
                                )
                              }
                            >
                              <IconUserOff size={16} />
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
                Сотрудники не найдены
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
        title={editing ? "Изменить сотрудника" : "Новый сотрудник"}
        onSubmit={handleSubmit}
        submitting={createStaff.isPending || updateStaff.isPending}
      >
        <TextInput label="ФИО" {...form.getInputProps("fullName")} />
        <TextInput
          label="Логин"
          disabled={Boolean(editing)}
          {...form.getInputProps("login")}
        />
        {!editing ? (
          <PasswordInput
            label="Пароль"
            {...form.getInputProps("password")}
          />
        ) : null}
        <Select
          label="Роль"
          data={ROLE_OPTIONS}
          {...form.getInputProps("role")}
        />
      </FormModal>
    </Stack>
  );
}

export default function StaffPage() {
  return (
    <RequireRole roles={["ADMIN"]}>
      <StaffContent />
    </RequireRole>
  );
}
