"use client";

import { Stack } from "@mantine/core";
import dayjs from "dayjs";
import { useFinanceSummary } from "@/entities/finance/queries";
import { RequireRole } from "@/features/auth/ui/require-role";
import { PageHeader } from "@/shared/ui/page-header";
import { QueryState } from "@/shared/ui/query-state";
import { FinanceChart } from "@/widgets/finance/finance-chart";
import { FinanceRecentOrders } from "@/widgets/finance/finance-recent-orders";
import { FinanceSummaryCards } from "@/widgets/finance/finance-summary-cards";

function DashboardContent() {
  const from = dayjs().subtract(29, "day").format("YYYY-MM-DD");
  const to = dayjs().format("YYYY-MM-DD");
  const { data, isLoading, error } = useFinanceSummary({
    from,
    to,
    groupBy: "day",
  });

  return (
    <Stack>
      <PageHeader
        title="Дашборд"
        description="Ключевые показатели за последние 30 дней"
      />
      <QueryState isLoading={isLoading} error={error}>
        {data ? (
          <>
            <FinanceSummaryCards summary={data} />
            <FinanceChart data={data.chart} />
            <FinanceRecentOrders orders={data.recentOrders} />
          </>
        ) : null}
      </QueryState>
    </Stack>
  );
}

export default function DashboardPage() {
  return (
    <RequireRole roles={["ADMIN", "MANAGER"]}>
      <DashboardContent />
    </RequireRole>
  );
}
