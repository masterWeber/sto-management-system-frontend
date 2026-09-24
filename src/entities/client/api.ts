import { apiFetch, withQuery } from "@/shared/api/client";
import type {
  Client,
  ClientFilters,
  CreateClientInput,
  Page,
  UpdateClientInput,
} from "@/shared/api/types";

export const clientApi = {
  list: (filters?: ClientFilters) =>
    apiFetch<Page<Client>>(withQuery("/clients", filters)),
  get: (id: string) => apiFetch<Client>(`/clients/${id}`),
  create: (input: CreateClientInput) =>
    apiFetch<Client>("/clients", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  update: (id: string, input: UpdateClientInput) =>
    apiFetch<Client>(`/clients/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  remove: (id: string) =>
    apiFetch<void>(`/clients/${id}`, { method: "DELETE" }),
};
