import { apiFetch, withQuery } from "@/shared/api/client";
import type {
  CreateProductCategoryInput,
  CreateProductInput,
  Page,
  Product,
  ProductCategory,
  ProductFilters,
  UpdateProductInput,
} from "@/shared/api/types";

export const productCategoryApi = {
  list: (params?: { page?: number; limit?: number }) =>
    apiFetch<Page<ProductCategory>>(
      withQuery("/product-categories", params),
    ),
  create: (input: CreateProductCategoryInput) =>
    apiFetch<ProductCategory>("/product-categories", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  update: (id: string, input: CreateProductCategoryInput) =>
    apiFetch<ProductCategory>(`/product-categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  remove: (id: string) =>
    apiFetch<void>(`/product-categories/${id}`, { method: "DELETE" }),
};

export const productApi = {
  list: (filters?: ProductFilters) =>
    apiFetch<Page<Product>>(withQuery("/products", filters)),
  get: (id: string) => apiFetch<Product>(`/products/${id}`),
  create: (input: CreateProductInput) =>
    apiFetch<Product>("/products", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  update: (id: string, input: UpdateProductInput) =>
    apiFetch<Product>(`/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  remove: (id: string) =>
    apiFetch<void>(`/products/${id}`, { method: "DELETE" }),
};
