"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/query-keys";
import type {
  CreateExpenseInput,
  ExpenseFilters,
  UpdateExpenseInput,
} from "@/shared/api/types";
import { expenseApi } from "./api";

export function useExpenses(filters?: ExpenseFilters) {
  return useQuery({
    queryKey: queryKeys.expenses.list(filters),
    queryFn: () => expenseApi.list(filters),
    placeholderData: (prev) => prev,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateExpenseInput) => expenseApi.create(input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all }),
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateExpenseInput }) =>
      expenseApi.update(id, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all }),
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => expenseApi.remove(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all }),
  });
}
