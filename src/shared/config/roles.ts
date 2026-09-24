import type { Role } from "../api/types";

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Администратор",
  MANAGER: "Менеджер",
  MASTER: "Мастер",
};

export type Section =
  | "dashboard"
  | "clients"
  | "cars"
  | "orders"
  | "priceList"
  | "warehouse"
  | "finance"
  | "expenses"
  | "staff";

export const SECTION_ACCESS: Record<Section, Role[]> = {
  dashboard: ["ADMIN", "MANAGER"],
  clients: ["ADMIN", "MANAGER"],
  cars: ["ADMIN", "MANAGER"],
  orders: ["ADMIN", "MANAGER", "MASTER"],
  priceList: ["ADMIN", "MANAGER"],
  warehouse: ["ADMIN", "MANAGER"],
  finance: ["ADMIN", "MANAGER"],
  expenses: ["ADMIN", "MANAGER"],
  staff: ["ADMIN"],
};

export function canAccess(role: Role | undefined, section: Section): boolean {
  if (!role) return false;
  return SECTION_ACCESS[section].includes(role);
}

export function hasRole(role: Role | undefined, roles: Role[]): boolean {
  return role !== undefined && roles.includes(role);
}
