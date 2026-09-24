"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/query-keys";
import type {
  CreateStaffInput,
  UpdateStaffInput,
} from "@/shared/api/types";
import { staffApi } from "./api";

export function useMe() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: staffApi.me,
    retry: false,
    staleTime: 5 * 60_000,
  });
}

export function useStaffList(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.staff.list(params),
    queryFn: () => staffApi.list(params),
  });
}

export function useCreateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateStaffInput) => staffApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.staff.all }),
  });
}

export function useUpdateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateStaffInput }) =>
      staffApi.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.staff.all }),
  });
}

export function useDeactivateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => staffApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.staff.all }),
  });
}
