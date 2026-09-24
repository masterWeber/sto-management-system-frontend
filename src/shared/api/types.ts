export type Role = "ADMIN" | "MANAGER" | "MASTER";

export type OrderStatus = "RECEIVED" | "IN_PROGRESS" | "COMPLETED" | "PAID";

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND_ERROR"
  | "CONFLICT_ERROR"
  | "VALIDATION_ERROR"
  | "INTERNAL_SERVER_ERROR";

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiErrorBody {
  statusCode: number;
  error: ApiErrorCode;
  message: string | string[];
}

export interface Staff {
  id: string;
  fullName: string;
  login: string;
  role: Role;
  isActive: boolean;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface Car {
  id: string;
  make: string;
  year: number;
  licensePlate: string;
  vin: string | null;
  clientId: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
}

export interface Service {
  id: string;
  name: string;
  priceKopecks: number;
  categoryId: string;
}

export interface ProductCategory {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  inStock: boolean;
  categoryId: string;
}

export interface OrderItem {
  id: string;
  name: string;
  priceKopecks: number;
}

export interface Order {
  id: string;
  clientId: string;
  carId: string;
  scheduledAt: string;
  status: OrderStatus;
  comment: string | null;
  assignedMasterId: string | null;
  completedAt: string | null;
  paidAt: string | null;
  items: OrderItem[];
  totalKopecks: number;
}

export interface Expense {
  id: string;
  date: string;
  amountKopecks: number;
  description: string;
  category: string | null;
}

export interface FinanceChartPoint {
  bucket: string;
  revenueKopecks: number;
  expensesKopecks: number;
}

export interface FinanceRecentOrder {
  orderId: string;
  clientId: string;
  scheduledAt: string;
  status: OrderStatus;
  totalKopecks: number;
}

export interface FinanceSummary {
  revenueKopecks: number;
  expensesKopecks: number;
  netProfitKopecks: number;
  averageCheckKopecks: number;
  clientsCount: number;
  ordersCount: number;
  chart: FinanceChartPoint[];
  recentOrders: FinanceRecentOrder[];
}

export interface LoginInput {
  login: string;
  password: string;
}

export interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateStaffInput {
  fullName: string;
  login: string;
  password: string;
  role: Role;
}

export interface UpdateStaffInput {
  fullName?: string;
  role?: Role;
}

export interface CreateClientInput {
  firstName: string;
  lastName: string;
  phone: string;
}

export type UpdateClientInput = Partial<CreateClientInput>;

export interface CreateCarInput {
  make: string;
  year: number;
  licensePlate: string;
  vin?: string;
  clientId: string;
}

export type UpdateCarInput = Omit<Partial<CreateCarInput>, "clientId">;

export interface CreateServiceCategoryInput {
  name: string;
}

export interface CreateServiceInput {
  name: string;
  priceKopecks: number;
  categoryId: string;
}

export type UpdateServiceInput = Omit<Partial<CreateServiceInput>, "categoryId">;

export interface CreateProductCategoryInput {
  name: string;
}

export interface CreateProductInput {
  name: string;
  sku: string;
  quantity: number;
  categoryId: string;
}

export type UpdateProductInput = Omit<Partial<CreateProductInput>, "categoryId">;

export interface CreateOrderInput {
  clientId: string;
  carId: string;
  scheduledAt: string;
  comment?: string;
}

export interface UpdateOrderInput {
  scheduledAt?: string;
  comment?: string;
  assignedMasterId?: string | null;
}

export interface TransitionOrderStatusInput {
  status: OrderStatus;
  adminOverride?: boolean;
}

export interface AddOrderItemInput {
  serviceId?: string;
  name?: string;
  priceKopecks?: number;
}

export interface CreateExpenseInput {
  date: string;
  amountKopecks: number;
  description: string;
  category?: string;
}

export type UpdateExpenseInput = Partial<CreateExpenseInput>;

export type FinanceGroupBy = "day" | "week" | "month" | "quarter";

export interface ClientFilters extends ListParams {
  phone?: string;
}

export interface CarFilters extends ListParams {
  licensePlate?: string;
  clientId?: string;
}

export interface ServiceFilters extends ListParams {
  categoryId?: string;
}

export interface ProductFilters extends ListParams {
  sku?: string;
  inStock?: boolean;
  categoryId?: string;
}

export interface OrderFilters extends ListParams {
  status?: OrderStatus;
  clientId?: string;
  carId?: string;
  assignedMasterId?: string;
  scheduledFrom?: string;
  scheduledTo?: string;
}

export interface ExpenseFilters extends ListParams {
  from?: string;
  to?: string;
  category?: string;
}
