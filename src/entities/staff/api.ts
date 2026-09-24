import { apiFetch, withQuery } from "@/shared/api/client";
import type {
  CreateStaffInput,
  Page,
  Staff,
  UpdateStaffInput,
} from "@/shared/api/types";

export const staffApi = {
  me: () => apiFetch<Staff>("/staff/me"),
  list: (params?: { page?: number; limit?: number }) =>
    apiFetch<Page<Staff>>(withQuery("/staff", params)),
  get: (id: string) => apiFetch<Staff>(`/staff/${id}`),
  create: (input: CreateStaffInput) =>
    apiFetch<Staff>("/staff", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  update: (id: string, input: UpdateStaffInput) =>
    apiFetch<Staff>(`/staff/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  remove: (id: string) =>
    apiFetch<void>(`/staff/${id}`, { method: "DELETE" }),
};
