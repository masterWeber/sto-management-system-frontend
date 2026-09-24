import { apiFetch, withQuery } from "@/shared/api/client";
import type {
  CreateExpenseInput,
  Expense,
  ExpenseFilters,
  Page,
  UpdateExpenseInput,
} from "@/shared/api/types";

export const expenseApi = {
  list: (filters?: ExpenseFilters) =>
    apiFetch<Page<Expense>>(withQuery("/expenses", filters)),
  get: (id: string) => apiFetch<Expense>(`/expenses/${id}`),
  create: (input: CreateExpenseInput) =>
    apiFetch<Expense>("/expenses", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  update: (id: string, input: UpdateExpenseInput) =>
    apiFetch<Expense>(`/expenses/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  remove: (id: string) =>
    apiFetch<void>(`/expenses/${id}`, { method: "DELETE" }),
};
