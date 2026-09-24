"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/query-keys";
import { financeApi, type FinanceParams } from "./api";

export function useFinanceSummary(params: FinanceParams, enabled = true) {
  return useQuery({
    queryKey: queryKeys.finance.summary(params),
    queryFn: () => financeApi.summary(params),
    enabled,
    placeholderData: (prev) => prev,
  });
}
