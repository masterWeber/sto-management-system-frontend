import type { OrderStatus } from "../api/types";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  RECEIVED: "Принят",
  IN_PROGRESS: "В работе",
  COMPLETED: "Завершён",
  PAID: "Оплачен",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  RECEIVED: "blue",
  IN_PROGRESS: "yellow",
  COMPLETED: "grape",
  PAID: "green",
};

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "RECEIVED",
  "IN_PROGRESS",
  "COMPLETED",
  "PAID",
];
