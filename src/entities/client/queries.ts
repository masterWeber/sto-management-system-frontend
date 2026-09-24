"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/query-keys";
import type {
  ClientFilters,
  CreateClientInput,
  UpdateClientInput,
} from "@/shared/api/types";
import { clientApi } from "./api";

export function useClients(filters?: ClientFilters) {
  return useQuery({
    queryKey: queryKeys.clients.list(filters),
    queryFn: () => clientApi.list(filters),
    placeholderData: (prev) => prev,
  });
}

export function useClient(id: string) {
  return useQuery({
    queryKey: queryKeys.clients.detail(id),
    queryFn: () => clientApi.get(id),
    enabled: Boolean(id),
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateClientInput) => clientApi.create(input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all }),
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateClientInput }) =>
      clientApi.update(id, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all }),
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clientApi.remove(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all }),
  });
}
