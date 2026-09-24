"use client";

import { useState } from "react";
import {
  ActionIcon,
  Button,
  Card,
  Group,
  NumberInput,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { zodValidate } from "@/shared/lib/form";
import { z } from "zod";
import {
  useCreateService,
  useCreateServiceCategory,
  useDeleteService,
  useDeleteServiceCategory,
  useServiceCategories,
  useServices,
  useUpdateService,
  useUpdateServiceCategory,
} from "@/entities/service/queries";
import { RequireRole } from "@/features/auth/ui/require-role";
import type { Service, ServiceCategory } from "@/shared/api/types";
import { formatMoney, kopecksToRubles, rublesToKopecks } from "@/shared/lib/money";
import { useListParams } from "@/shared/lib/use-list-params";
import { confirmDelete } from "@/shared/ui/confirm";
import { FormModal } from "@/shared/ui/form-modal";
import { ListPagination } from "@/shared/ui/list-pagination";
import { notifyError, notifySuccess } from "@/shared/ui/notify";
import { PageHeader } from "@/shared/ui/page-header";
import { QueryState } from "@/shared/ui/query-state";
import { SearchInput } from "@/shared/ui/search-input";

const serviceSchema = z.object({
  name: z.string().min(1, "Укажите название"),
  price: z
    .number({ message: "Укажите цену" })
    .min(0, "Цена не может быть отрицательной"),
  categoryId: z.string().min(1, "Выберите категорию"),
});

interface ServiceFormValues {
  name: string;
  price: number | string;
  categoryId: string;
}

function PriceListContent() {
  const { page, setPage, search, onSearch, searchValue, limit } =
    useListParams();
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const [serviceOpened, setServiceOpened] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [categoryOpened, setCategoryOpened] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<ServiceCategory | null>(null);

  const categories = useServiceCategories({ limit: 100 });
  const services = useServices({
    page,
    limit,
    search: searchValue,
    categoryId: categoryFilter ?? undefined,
  });

  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();
  const createCategory = useCreateServiceCategory();
  const updateCategory = useUpdateServiceCategory();
  const deleteCategory = useDeleteServiceCategory();

  const categoryOptions =
    categories.data?.items.map((item) => ({
      value: item.id,
      label: item.name,
    })) ?? [];

  const categoryName = (categoryId: string) =>
    categories.data?.items.find((item) => item.id === categoryId)?.name ?? "—";

  const serviceForm = useForm<ServiceFormValues>({
    validate: zodValidate<ServiceFormValues>(serviceSchema),
    initialValues: { name: "", price: 0, categoryId: "" },
  });

  const categoryForm = useForm<{ name: string }>({
    validate: zodValidate<{ name: string }>(
      z.object({ name: z.string().min(1, "Укажите название") }),
    ),
    initialValues: { name: "" },
  });

  const openCreateService = () => {
    setEditingService(null);
    serviceForm.setValues({
      name: "",
      price: 0,
      categoryId: categoryFilter ?? "",
    });
    setServiceOpened(true);
  };

  const openEditService = (service: Service) => {
    setEditingService(service);
    serviceForm.setValues({
      name: service.name,
      price: kopecksToRubles(service.priceKopecks),
      categoryId: service.categoryId,
    });
    setServiceOpened(true);
  };

  const handleServiceSubmit = serviceForm.onSubmit((values) => {
    const priceKopecks = rublesToKopecks(Number(values.price) || 0);
    const options = {
      onSuccess: () => {
        notifySuccess(editingService ? "Услуга обновлена" : "Услуга добавлена");
        setServiceOpened(false);
      },
      onError: notifyError,
    };
    if (editingService) {
      updateService.mutate(
        {
          id: editingService.id,
          input: { name: values.name, priceKopecks },
        },
        options,
      );
    } else {
      createService.mutate(
        { name: values.name, priceKopecks, categoryId: values.categoryId },
        options,
      );
    }
  });

  const openCreateCategory = () => {
    setEditingCategory(null);
    categoryForm.setValues({ name: "" });
    setCategoryOpened(true);
  };

  const openEditCategory = (category: ServiceCategory) => {
    setEditingCategory(category);
    categoryForm.setValues({ name: category.name });
    setCategoryOpened(true);
  };

  const handleCategorySubmit = categoryForm.onSubmit((values) => {
    const options = {
      onSuccess: () => {
        notifySuccess(
          editingCategory ? "Категория обновлена" : "Категория добавлена",
        );
        setCategoryOpened(false);
      },
      onError: notifyError,
    };
    if (editingCategory) {
      updateCategory.mutate({ id: editingCategory.id, input: values }, options);
    } else {
      createCategory.mutate(values, options);
    }
  });

  return (
    <Stack>
      <PageHeader
        title="Прайс-лист"
        description="Услуги и категории"
        action={
          <Button leftSection={<IconPlus size={16} />} onClick={openCreateService}>
            Добавить услугу
          </Button>
        }
      />

      <Card withBorder padding="lg">
        <Group justify="space-between" mb="md">
          <Title order={4}>Категории услуг</Title>
          <Button
            variant="light"
            size="xs"
            leftSection={<IconPlus size={14} />}
            onClick={openCreateCategory}
          >
            Добавить категорию
          </Button>
        </Group>
        <QueryState
          isLoading={categories.isLoading}
          error={categories.error}
        >
          {categories.data && categories.data.items.length > 0 ? (
            <Group gap="xs">
              {categories.data.items.map((category) => (
                <Group
                  key={category.id}
                  gap={4}
                  px="sm"
                  py={4}
                  bg="var(--mantine-color-default-hover)"
                  style={{ borderRadius: 8 }}
                >
                  <Text size="sm">{category.name}</Text>
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    aria-label="Изменить категорию"
                    onClick={() => openEditCategory(category)}
                  >
                    <IconPencil size={14} />
                  </ActionIcon>
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="red"
                    aria-label="Удалить категорию"
                    onClick={() =>
                      confirmDelete(
                        `Удалить категорию «${category.name}»?`,
                        () =>
                          deleteCategory.mutate(category.id, {
                            onSuccess: () => notifySuccess("Категория удалена"),
                            onError: notifyError,
                          }),
                      )
                    }
                  >
                    <IconTrash size={14} />
                  </ActionIcon>
                </Group>
              ))}
            </Group>
          ) : (
            <Text c="dimmed" size="sm">
              Категории не добавлены
            </Text>
          )}
        </QueryState>
      </Card>

      <Group>
        <SearchInput
          value={search}
          onChange={onSearch}
          placeholder="Поиск по названию услуги"
        />
        <Select
          data={categoryOptions}
          value={categoryFilter}
          onChange={(value) => {
            setCategoryFilter(value);
            setPage(1);
          }}
          placeholder="Все категории"
          clearable
          w={240}
        />
      </Group>

      <QueryState isLoading={services.isLoading} error={services.error}>
        {services.data ? (
          <>
            <Table.ScrollContainer minWidth={640}>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Услуга</Table.Th>
                    <Table.Th>Категория</Table.Th>
                    <Table.Th ta="right">Цена</Table.Th>
                    <Table.Th w={120} />
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {services.data.items.map((service) => (
                    <Table.Tr key={service.id}>
                      <Table.Td>{service.name}</Table.Td>
                      <Table.Td>{categoryName(service.categoryId)}</Table.Td>
                      <Table.Td ta="right">
                        {formatMoney(service.priceKopecks)}
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs" justify="flex-end">
                          <ActionIcon
                            variant="subtle"
                            aria-label="Изменить"
                            onClick={() => openEditService(service)}
                          >
                            <IconPencil size={16} />
                          </ActionIcon>
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            aria-label="Удалить"
                            onClick={() =>
                              confirmDelete(
                                `Удалить услугу «${service.name}»?`,
                                () =>
                                  deleteService.mutate(service.id, {
                                    onSuccess: () =>
                                      notifySuccess("Услуга удалена"),
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

            {services.data.items.length === 0 ? (
              <Text c="dimmed" ta="center" py="md">
                Услуги не найдены
              </Text>
            ) : null}

            <ListPagination
              page={page}
              limit={limit}
              total={services.data.total}
              onPageChange={setPage}
            />
          </>
        ) : null}
      </QueryState>

      <FormModal
        opened={serviceOpened}
        onClose={() => setServiceOpened(false)}
        title={editingService ? "Изменить услугу" : "Новая услуга"}
        onSubmit={handleServiceSubmit}
        submitting={createService.isPending || updateService.isPending}
      >
        <TextInput label="Название" {...serviceForm.getInputProps("name")} />
        <NumberInput
          label="Цена, ₽"
          min={0}
          decimalScale={2}
          {...serviceForm.getInputProps("price")}
        />
        <Select
          label="Категория"
          data={categoryOptions}
          disabled={Boolean(editingService)}
          {...serviceForm.getInputProps("categoryId")}
        />
      </FormModal>

      <FormModal
        opened={categoryOpened}
        onClose={() => setCategoryOpened(false)}
        title={editingCategory ? "Изменить категорию" : "Новая категория"}
        onSubmit={handleCategorySubmit}
        submitting={createCategory.isPending || updateCategory.isPending}
      >
        <TextInput label="Название" {...categoryForm.getInputProps("name")} />
      </FormModal>
    </Stack>
  );
}

export default function PriceListPage() {
  return (
    <RequireRole roles={["ADMIN", "MANAGER"]}>
      <PriceListContent />
    </RequireRole>
  );
}
