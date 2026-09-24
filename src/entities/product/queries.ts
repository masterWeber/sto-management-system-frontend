"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/query-keys";
import type {
  CreateProductCategoryInput,
  CreateProductInput,
  ProductFilters,
  UpdateProductInput,
} from "@/shared/api/types";
import { productApi, productCategoryApi } from "./api";

export function useProductCategories(params?: {
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: queryKeys.productCategories.list(params),
    queryFn: () => productCategoryApi.list(params),
  });
}

export function useCreateProductCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProductCategoryInput) =>
      productCategoryApi.create(input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.productCategories.all,
      }),
  });
}

export function useUpdateProductCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: CreateProductCategoryInput;
    }) => productCategoryApi.update(id, input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.productCategories.all,
      }),
  });
}

export function useDeleteProductCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productCategoryApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.productCategories.all,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => productApi.list(filters),
    placeholderData: (prev) => prev,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProductInput) => productApi.create(input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateProductInput }) =>
      productApi.update(id, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all }),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productApi.remove(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all }),
  });
}
