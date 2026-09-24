import { apiFetch, withQuery } from "@/shared/api/client";
import type {
  AddOrderItemInput,
  CreateOrderInput,
  Order,
  OrderFilters,
  OrderItem,
  Page,
  TransitionOrderStatusInput,
  UpdateOrderInput,
} from "@/shared/api/types";

export const orderApi = {
  list: (filters?: OrderFilters) =>
    apiFetch<Page<Order>>(withQuery("/orders", filters)),
  get: (id: string) => apiFetch<Order>(`/orders/${id}`),
  create: (input: CreateOrderInput) =>
    apiFetch<Order>("/orders", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  update: (id: string, input: UpdateOrderInput) =>
    apiFetch<Order>(`/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  remove: (id: string) =>
    apiFetch<void>(`/orders/${id}`, { method: "DELETE" }),
  changeStatus: (id: string, input: TransitionOrderStatusInput) =>
    apiFetch<Order>(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  addItem: (id: string, input: AddOrderItemInput) =>
    apiFetch<OrderItem>(`/orders/${id}/items`, {
      method: "POST",
      body: JSON.stringify(input),
    }),
  removeItem: (id: string, itemId: string) =>
    apiFetch<void>(`/orders/${id}/items/${itemId}`, { method: "DELETE" }),
  actPath: (id: string) => `/orders/${id}/act.pdf`,
  contractPath: (id: string) => `/orders/${id}/contract.pdf`,
};
