import { apiFetch, withQuery } from "@/shared/api/client";
import type {
  Car,
  CarFilters,
  CreateCarInput,
  Page,
  UpdateCarInput,
} from "@/shared/api/types";

export const carApi = {
  list: (filters?: CarFilters) =>
    apiFetch<Page<Car>>(withQuery("/cars", filters)),
  get: (id: string) => apiFetch<Car>(`/cars/${id}`),
  create: (input: CreateCarInput) =>
    apiFetch<Car>("/cars", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  update: (id: string, input: UpdateCarInput) =>
    apiFetch<Car>(`/cars/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  remove: (id: string) => apiFetch<void>(`/cars/${id}`, { method: "DELETE" }),
};
