"use client";

import { useState } from "react";
import { Button, Group, Select, Stack } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import dayjs from "dayjs";
import { IconDownload } from "@tabler/icons-react";
import { financeApi } from "@/entities/finance/api";
import { useFinanceSummary } from "@/entities/finance/queries";
import { RequireRole } from "@/features/auth/ui/require-role";
import { apiDownload } from "@/shared/api/client";
import type { FinanceGroupBy } from "@/shared/api/types";
import { FinanceChart } from "@/widgets/finance/finance-chart";
import { FinanceRecentOrders } from "@/widgets/finance/finance-recent-orders";
import { FinanceSummaryCards } from "@/widgets/finance/finance-summary-cards";
import { notifyError } from "@/shared/ui/notify";
import { PageHeader } from "@/shared/ui/page-header";
import { QueryState } from "@/shared/ui/query-state";

const GROUP_OPTIONS: { value: FinanceGroupBy; label: string }[] = [
  { value: "day", label: "По дням" },
  { value: "week", label: "По неделям" },
  { value: "month", label: "По месяцам" },
  { value: "quarter", label: "По кварталам" },
];

function FinanceContent() {
  const [from, setFrom] = useState<string | null>(
    dayjs().subtract(29, "day").format("YYYY-MM-DD"),
  );
  const [to, setTo] = useState<string | null>(
    dayjs().format("YYYY-MM-DD"),
  );
  const [groupBy, setGroupBy] = useState<FinanceGroupBy>("day");

  const params = {
    from: from ?? "",
    to: to ?? "",
    groupBy,
  };

  const { data, isLoading, error } = useFinanceSummary(
    params,
    Boolean(from && to),
  );

  const downloadReport = async () => {
    try {
      await apiDownload(financeApi.reportPath(params), "finance-report.pdf");
    } catch (downloadError) {
      notifyError(downloadError);
    }
  };

  return (
    <Stack>
      <PageHeader
        title="Финансы"
        description="Доходы, расходы и прибыль"
        action={
          <Button
            leftSection={<IconDownload size={16} />}
            variant="default"
            onClick={downloadReport}
          >
            Скачать отчёт
          </Button>
        }
      />

      <Group align="flex-end">
        <DatePickerInput
          label="С"
          value={from}
          onChange={setFrom}
          valueFormat="DD.MM.YYYY"
          w={180}
        />
        <DatePickerInput
          label="По"
          value={to}
          onChange={setTo}
          valueFormat="DD.MM.YYYY"
          w={180}
        />
        <Select
          label="Группировка"
          data={GROUP_OPTIONS}
          value={groupBy}
          onChange={(value) => setGroupBy((value as FinanceGroupBy) ?? "day")}
          w={180}
        />
      </Group>

      <QueryState isLoading={isLoading} error={error}>
        {data ? (
          <Stack>
            <FinanceSummaryCards summary={data} />
            <FinanceChart data={data.chart} />
            <FinanceRecentOrders orders={data.recentOrders} />
          </Stack>
        ) : null}
      </QueryState>
    </Stack>
  );
}

export default function FinancePage() {
  return (
    <RequireRole roles={["ADMIN", "MANAGER"]}>
      <FinanceContent />
    </RequireRole>
  );
}
