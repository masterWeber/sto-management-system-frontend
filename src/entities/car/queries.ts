"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/query-keys";
import type {
  CarFilters,
  CreateCarInput,
  UpdateCarInput,
} from "@/shared/api/types";
import { carApi } from "./api";

export function useCars(filters?: CarFilters) {
  return useQuery({
    queryKey: queryKeys.cars.list(filters),
    queryFn: () => carApi.list(filters),
    placeholderData: (prev) => prev,
  });
}

export function useCar(id: string) {
  return useQuery({
    queryKey: queryKeys.cars.detail(id),
    queryFn: () => carApi.get(id),
    enabled: Boolean(id),
  });
}

export function useCreateCar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCarInput) => carApi.create(input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.cars.all }),
  });
}

export function useUpdateCar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCarInput }) =>
      carApi.update(id, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.cars.all }),
  });
}

export function useDeleteCar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => carApi.remove(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.cars.all }),
  });
}
