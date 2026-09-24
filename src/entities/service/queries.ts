"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/query-keys";
import type {
  CreateServiceCategoryInput,
  CreateServiceInput,
  ServiceFilters,
  UpdateServiceInput,
} from "@/shared/api/types";
import { serviceApi, serviceCategoryApi } from "./api";

export function useServiceCategories(params?: {
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: queryKeys.serviceCategories.list(params),
    queryFn: () => serviceCategoryApi.list(params),
  });
}

export function useCreateServiceCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateServiceCategoryInput) =>
      serviceCategoryApi.create(input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.serviceCategories.all,
      }),
  });
}

export function useUpdateServiceCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: CreateServiceCategoryInput;
    }) => serviceCategoryApi.update(id, input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.serviceCategories.all,
      }),
  });
}

export function useDeleteServiceCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => serviceCategoryApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.serviceCategories.all,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
    },
  });
}

export function useServices(filters?: ServiceFilters) {
  return useQuery({
    queryKey: queryKeys.services.list(filters),
    queryFn: () => serviceApi.list(filters),
    placeholderData: (prev) => prev,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateServiceInput) => serviceApi.create(input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all }),
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateServiceInput }) =>
      serviceApi.update(id, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all }),
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => serviceApi.remove(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all }),
  });
}
