"use client";

import { useState } from "react";
import {
  ActionIcon,
  Badge,
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
  useCreateProduct,
  useCreateProductCategory,
  useDeleteProduct,
  useDeleteProductCategory,
  useProductCategories,
  useProducts,
  useUpdateProduct,
  useUpdateProductCategory,
} from "@/entities/product/queries";
import { RequireRole } from "@/features/auth/ui/require-role";
import type { Product, ProductCategory } from "@/shared/api/types";
import { useListParams } from "@/shared/lib/use-list-params";
import { confirmDelete } from "@/shared/ui/confirm";
import { FormModal } from "@/shared/ui/form-modal";
import { ListPagination } from "@/shared/ui/list-pagination";
import { notifyError, notifySuccess } from "@/shared/ui/notify";
import { PageHeader } from "@/shared/ui/page-header";
import { QueryState } from "@/shared/ui/query-state";
import { SearchInput } from "@/shared/ui/search-input";

const productSchema = z.object({
  name: z.string().min(1, "Укажите название"),
  sku: z.string().min(1, "Укажите артикул"),
  quantity: z
    .number({ message: "Укажите количество" })
    .int("Целое число")
    .min(0, "Не может быть отрицательным"),
  categoryId: z.string().min(1, "Выберите категорию"),
});

interface ProductFormValues {
  name: string;
  sku: string;
  quantity: number | string;
  categoryId: string;
}

const STOCK_OPTIONS = [
  { value: "ALL", label: "Все товары" },
  { value: "IN", label: "В наличии" },
  { value: "OUT", label: "Нет в наличии" },
];

function WarehouseContent() {
  const { page, setPage, search, onSearch, searchValue, limit } =
    useListParams();
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [stockFilter, setStockFilter] = useState<string>("ALL");

  const [productOpened, setProductOpened] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [categoryOpened, setCategoryOpened] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<ProductCategory | null>(null);

  const categories = useProductCategories({ limit: 100 });
  const products = useProducts({
    page,
    limit,
    search: searchValue,
    categoryId: categoryFilter ?? undefined,
    inStock:
      stockFilter === "ALL" ? undefined : stockFilter === "IN",
  });

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const createCategory = useCreateProductCategory();
  const updateCategory = useUpdateProductCategory();
  const deleteCategory = useDeleteProductCategory();

  const categoryOptions =
    categories.data?.items.map((item) => ({
      value: item.id,
      label: item.name,
    })) ?? [];

  const categoryName = (categoryId: string) =>
    categories.data?.items.find((item) => item.id === categoryId)?.name ?? "—";

  const productForm = useForm<ProductFormValues>({
    validate: zodValidate<ProductFormValues>(productSchema),
    initialValues: { name: "", sku: "", quantity: 0, categoryId: "" },
  });

  const categoryForm = useForm<{ name: string }>({
    validate: zodValidate<{ name: string }>(
      z.object({ name: z.string().min(1, "Укажите название") }),
    ),
    initialValues: { name: "" },
  });

  const openCreateProduct = () => {
    setEditingProduct(null);
    productForm.setValues({
      name: "",
      sku: "",
      quantity: 0,
      categoryId: categoryFilter ?? "",
    });
    setProductOpened(true);
  };

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    productForm.setValues({
      name: product.name,
      sku: product.sku,
      quantity: product.quantity,
      categoryId: product.categoryId,
    });
    setProductOpened(true);
  };

  const handleProductSubmit = productForm.onSubmit((values) => {
    const quantity = Number(values.quantity) || 0;
    const options = {
      onSuccess: () => {
        notifySuccess(editingProduct ? "Товар обновлён" : "Товар добавлен");
        setProductOpened(false);
      },
      onError: notifyError,
    };
    if (editingProduct) {
      updateProduct.mutate(
        {
          id: editingProduct.id,
          input: { name: values.name, sku: values.sku, quantity },
        },
        options,
      );
    } else {
      createProduct.mutate(
        {
          name: values.name,
          sku: values.sku,
          quantity,
          categoryId: values.categoryId,
        },
        options,
      );
    }
  });

  const openCreateCategory = () => {
    setEditingCategory(null);
    categoryForm.setValues({ name: "" });
    setCategoryOpened(true);
  };

  const openEditCategory = (category: ProductCategory) => {
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
        title="Склад"
        description="Запчасти и материалы"
        action={
          <Button leftSection={<IconPlus size={16} />} onClick={openCreateProduct}>
            Добавить товар
          </Button>
        }
      />

      <Card withBorder padding="lg">
        <Group justify="space-between" mb="md">
          <Title order={4}>Категории товаров</Title>
          <Button
            variant="light"
            size="xs"
            leftSection={<IconPlus size={14} />}
            onClick={openCreateCategory}
          >
            Добавить категорию
          </Button>
        </Group>
        <QueryState isLoading={categories.isLoading} error={categories.error}>
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
          placeholder="Поиск по названию или артикулу"
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
          w={220}
        />
        <Select
          data={STOCK_OPTIONS}
          value={stockFilter}
          onChange={(value) => {
            setStockFilter(value ?? "ALL");
            setPage(1);
          }}
          w={180}
        />
      </Group>

      <QueryState isLoading={products.isLoading} error={products.error}>
        {products.data ? (
          <>
            <Table.ScrollContainer minWidth={720}>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Наименование</Table.Th>
                    <Table.Th>Артикул</Table.Th>
                    <Table.Th>Категория</Table.Th>
                    <Table.Th ta="right">Кол-во</Table.Th>
                    <Table.Th>Наличие</Table.Th>
                    <Table.Th w={120} />
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {products.data.items.map((product) => (
                    <Table.Tr key={product.id}>
                      <Table.Td>{product.name}</Table.Td>
                      <Table.Td>{product.sku}</Table.Td>
                      <Table.Td>{categoryName(product.categoryId)}</Table.Td>
                      <Table.Td ta="right">{product.quantity}</Table.Td>
                      <Table.Td>
                        <Badge
                          color={product.inStock ? "green" : "gray"}
                          variant="light"
                        >
                          {product.inStock ? "В наличии" : "Нет"}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs" justify="flex-end">
                          <ActionIcon
                            variant="subtle"
                            aria-label="Изменить"
                            onClick={() => openEditProduct(product)}
                          >
                            <IconPencil size={16} />
                          </ActionIcon>
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            aria-label="Удалить"
                            onClick={() =>
                              confirmDelete(
                                `Удалить товар «${product.name}»?`,
                                () =>
                                  deleteProduct.mutate(product.id, {
                                    onSuccess: () =>
                                      notifySuccess("Товар удалён"),
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

            {products.data.items.length === 0 ? (
              <Text c="dimmed" ta="center" py="md">
                Товары не найдены
              </Text>
            ) : null}

            <ListPagination
              page={page}
              limit={limit}
              total={products.data.total}
              onPageChange={setPage}
            />
          </>
        ) : null}
      </QueryState>

      <FormModal
        opened={productOpened}
        onClose={() => setProductOpened(false)}
        title={editingProduct ? "Изменить товар" : "Новый товар"}
        onSubmit={handleProductSubmit}
        submitting={createProduct.isPending || updateProduct.isPending}
      >
        <TextInput label="Наименование" {...productForm.getInputProps("name")} />
        <TextInput label="Артикул" {...productForm.getInputProps("sku")} />
        <NumberInput
          label="Количество"
          min={0}
          {...productForm.getInputProps("quantity")}
        />
        <Select
          label="Категория"
          data={categoryOptions}
          disabled={Boolean(editingProduct)}
          {...productForm.getInputProps("categoryId")}
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

export default function WarehousePage() {
  return (
    <RequireRole roles={["ADMIN", "MANAGER"]}>
      <WarehouseContent />
    </RequireRole>
  );
}
