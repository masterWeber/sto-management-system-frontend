"use client";

import { Card, Title } from "@mantine/core";
import { LineChart } from "@mantine/charts";
import dayjs from "dayjs";
import type { FinanceChartPoint } from "@/shared/api/types";
import { kopecksToRubles } from "@/shared/lib/money";

export function FinanceChart({ data }: { data: FinanceChartPoint[] }) {
  const chartData = data.map((point) => ({
    date: dayjs(point.bucket).format("DD.MM"),
    Выручка: kopecksToRubles(point.revenueKopecks),
    Расходы: kopecksToRubles(point.expensesKopecks),
  }));

  return (
    <Card withBorder padding="md" radius="md">
      <Title order={4} mb="md">
        Динамика доходов и расходов
      </Title>
      <LineChart
        h={300}
        data={chartData}
        dataKey="date"
        series={[
          { name: "Выручка", color: "blue.6" },
          { name: "Расходы", color: "red.6" },
        ]}
        curveType="linear"
        withLegend
      />
    </Card>
  );
}
