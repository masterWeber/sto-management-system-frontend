import { apiFetch, withQuery } from "@/shared/api/client";
import type { FinanceGroupBy, FinanceSummary } from "@/shared/api/types";

export interface FinanceParams {
  from: string;
  to: string;
  groupBy: FinanceGroupBy;
}

export const financeApi = {
  summary: (params: FinanceParams) =>
    apiFetch<FinanceSummary>(withQuery("/finance/summary", params)),
  reportPath: (params: FinanceParams) =>
    withQuery("/finance/report.pdf", params),
};
