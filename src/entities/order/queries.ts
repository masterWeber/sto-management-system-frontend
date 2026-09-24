"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/query-keys";
import type {
  AddOrderItemInput,
  CreateOrderInput,
  OrderFilters,
  TransitionOrderStatusInput,
  UpdateOrderInput,
} from "@/shared/api/types";
import { orderApi } from "./api";

export function useOrders(filters?: OrderFilters) {
  return useQuery({
    queryKey: queryKeys.orders.list(filters),
    queryFn: () => orderApi.list(filters),
    placeholderData: (prev) => prev,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => orderApi.get(id),
    enabled: Boolean(id),
  });
}

function useInvalidateOrder() {
  const queryClient = useQueryClient();
  return (id?: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    if (id) {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(id) });
    }
  };
}

export function useCreateOrder() {
  const invalidate = useInvalidateOrder();
  return useMutation({
    mutationFn: (input: CreateOrderInput) => orderApi.create(input),
    onSuccess: () => invalidate(),
  });
}

export function useUpdateOrder() {
  const invalidate = useInvalidateOrder();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateOrderInput }) =>
      orderApi.update(id, input),
    onSuccess: (_data, variables) => invalidate(variables.id),
  });
}

export function useDeleteOrder() {
  const invalidate = useInvalidateOrder();
  return useMutation({
    mutationFn: (id: string) => orderApi.remove(id),
    onSuccess: () => invalidate(),
  });
}

export function useChangeOrderStatus() {
  const invalidate = useInvalidateOrder();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: TransitionOrderStatusInput;
    }) => orderApi.changeStatus(id, input),
    onSuccess: (_data, variables) => invalidate(variables.id),
  });
}

export function useAddOrderItem() {
  const invalidate = useInvalidateOrder();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: AddOrderItemInput }) =>
      orderApi.addItem(id, input),
    onSuccess: (_data, variables) => invalidate(variables.id),
  });
}

export function useRemoveOrderItem() {
  const invalidate = useInvalidateOrder();
  return useMutation({
    mutationFn: ({ id, itemId }: { id: string; itemId: string }) =>
      orderApi.removeItem(id, itemId),
    onSuccess: (_data, variables) => invalidate(variables.id),
  });
}
