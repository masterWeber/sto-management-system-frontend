"use client";

import { useState } from "react";
import {
  ActionIcon,
  Button,
  Group,
  NumberInput,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import { zodValidate } from "@/shared/lib/form";
import { z } from "zod";
import {
  useCreateExpense,
  useDeleteExpense,
  useExpenses,
  useUpdateExpense,
} from "@/entities/expense/queries";
import { RequireRole } from "@/features/auth/ui/require-role";
import type { Expense } from "@/shared/api/types";
import { formatDate } from "@/shared/lib/dates";
import { formatMoney, kopecksToRubles, rublesToKopecks } from "@/shared/lib/money";
import { useListParams } from "@/shared/lib/use-list-params";
import { confirmDelete } from "@/shared/ui/confirm";
import { FormModal } from "@/shared/ui/form-modal";
import { ListPagination } from "@/shared/ui/list-pagination";
import { notifyError, notifySuccess } from "@/shared/ui/notify";
import { PageHeader } from "@/shared/ui/page-header";
import { QueryState } from "@/shared/ui/query-state";

const expenseSchema = z.object({
  date: z.string().min(1, "Укажите дату"),
  amount: z
    .number({ message: "Укажите сумму" })
    .min(0, "Сумма не может быть отрицательной"),
  description: z.string().min(1, "Укажите описание"),
  category: z.string().optional(),
});

interface ExpenseFormValues {
  date: string | null;
  amount: number | string;
  description: string;
  category: string;
}

function ExpensesContent() {
  const { page, setPage, limit } = useListParams();
  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);
  const [opened, setOpened] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);

  const { data, isLoading, error } = useExpenses({
    page,
    limit,
    from: from ?? undefined,
    to: to ?? undefined,
  });
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();
  const deleteExpense = useDeleteExpense();

  const form = useForm<ExpenseFormValues>({
    validate: zodValidate<ExpenseFormValues>(expenseSchema),
    initialValues: {
      date: dayjs().format("YYYY-MM-DD"),
      amount: 0,
      description: "",
      category: "",
    },
  });

  const openCreate = () => {
    setEditing(null);
    form.setValues({
      date: dayjs().format("YYYY-MM-DD"),
      amount: 0,
      description: "",
      category: "",
    });
    setOpened(true);
  };

  const openEdit = (expense: Expense) => {
    setEditing(expense);
    form.setValues({
      date: dayjs(expense.date).format("YYYY-MM-DD"),
      amount: kopecksToRubles(expense.amountKopecks),
      description: expense.description,
      category: expense.category ?? "",
    });
    setOpened(true);
  };

  const handleSubmit = form.onSubmit((values) => {
    if (!values.date) return;
    const input = {
      date: values.date,
      amountKopecks: rublesToKopecks(Number(values.amount) || 0),
      description: values.description,
      category: values.category || undefined,
    };
    const options = {
      onSuccess: () => {
        notifySuccess(editing ? "Расход обновлён" : "Расход добавлен");
        setOpened(false);
      },
      onError: notifyError,
    };
    if (editing) {
      updateExpense.mutate({ id: editing.id, input }, options);
    } else {
      createExpense.mutate(input, options);
    }
  });

  return (
    <Stack>
      <PageHeader
        title="Расходы"
        description="Затраты автосервиса"
        action={
          <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>
            Добавить расход
          </Button>
        }
      />

      <Group align="flex-end">
        <DatePickerInput
          label="С"
          value={from}
          onChange={(value) => {
            setFrom(value);
            setPage(1);
          }}
          valueFormat="DD.MM.YYYY"
          clearable
          w={180}
        />
        <DatePickerInput
          label="По"
          value={to}
          onChange={(value) => {
            setTo(value);
            setPage(1);
          }}
          valueFormat="DD.MM.YYYY"
          clearable
          w={180}
        />
      </Group>

      <QueryState isLoading={isLoading} error={error}>
        {data ? (
          <>
            <Table.ScrollContainer minWidth={720}>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Дата</Table.Th>
                    <Table.Th>Категория</Table.Th>
                    <Table.Th>Описание</Table.Th>
                    <Table.Th ta="right">Сумма</Table.Th>
                    <Table.Th w={120} />
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {data.items.map((expense) => (
                    <Table.Tr key={expense.id}>
                      <Table.Td>{formatDate(expense.date)}</Table.Td>
                      <Table.Td>{expense.category ?? "—"}</Table.Td>
                      <Table.Td>{expense.description}</Table.Td>
                      <Table.Td ta="right">
                        {formatMoney(expense.amountKopecks)}
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs" justify="flex-end">
                          <ActionIcon
                            variant="subtle"
                            aria-label="Изменить"
                            onClick={() => openEdit(expense)}
                          >
                            <IconPencil size={16} />
                          </ActionIcon>
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            aria-label="Удалить"
                            onClick={() =>
                              confirmDelete("Удалить этот расход?", () =>
                                deleteExpense.mutate(expense.id, {
                                  onSuccess: () =>
                                    notifySuccess("Расход удалён"),
                                  onError: notifyError,
                                }),
                              )
                            }
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
                Расходы не найдены
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
        title={editing ? "Изменить расход" : "Новый расход"}
        onSubmit={handleSubmit}
        submitting={createExpense.isPending || updateExpense.isPending}
      >
        <DatePickerInput
          label="Дата"
          valueFormat="DD.MM.YYYY"
          {...form.getInputProps("date")}
        />
        <NumberInput
          label="Сумма, ₽"
          min={0}
          decimalScale={2}
          {...form.getInputProps("amount")}
        />
        <TextInput
          label="Описание"
          {...form.getInputProps("description")}
        />
        <TextInput label="Категория" {...form.getInputProps("category")} />
      </FormModal>
    </Stack>
  );
}

export default function ExpensesPage() {
  return (
    <RequireRole roles={["ADMIN", "MANAGER"]}>
      <ExpensesContent />
    </RequireRole>
  );
}
