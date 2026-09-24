import { apiFetch, withQuery } from "@/shared/api/client";
import type {
  CreateServiceCategoryInput,
  CreateServiceInput,
  Page,
  Service,
  ServiceCategory,
  ServiceFilters,
  UpdateServiceInput,
} from "@/shared/api/types";

export const serviceCategoryApi = {
  list: (params?: { page?: number; limit?: number }) =>
    apiFetch<Page<ServiceCategory>>(
      withQuery("/service-categories", params),
    ),
  create: (input: CreateServiceCategoryInput) =>
    apiFetch<ServiceCategory>("/service-categories", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  update: (id: string, input: CreateServiceCategoryInput) =>
    apiFetch<ServiceCategory>(`/service-categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  remove: (id: string) =>
    apiFetch<void>(`/service-categories/${id}`, { method: "DELETE" }),
};

export const serviceApi = {
  list: (filters?: ServiceFilters) =>
    apiFetch<Page<Service>>(withQuery("/services", filters)),
  get: (id: string) => apiFetch<Service>(`/services/${id}`),
  create: (input: CreateServiceInput) =>
    apiFetch<Service>("/services", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  update: (id: string, input: UpdateServiceInput) =>
    apiFetch<Service>(`/services/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  remove: (id: string) =>
    apiFetch<void>(`/services/${id}`, { method: "DELETE" }),
};
