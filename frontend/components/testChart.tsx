"use client";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Monitor } from "lucide-react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import type { HabitAnalytics } from "@/context/AnalyticsContext";

interface chartProps {
  chartData: HabitAnalytics;
  chartConfig: ChartConfig;
}

export function ExampleChart(props: chartProps) {
  return (
    <ChartContainer
      config={props.chartConfig}
      className="min-h-[200px] min-w-[300px] max-w-[600px]"
    >
      <BarChart
        width={300}
        height={200}
        data={[
          {
            name: "Tracking",
            Completed: props.chartData.totalCompleted,
            Incomplete: props.chartData.totalDaysTracked - props.chartData.totalCompleted
          },
        ]}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />

        <Bar dataKey="Completed" fill="#10b981" />
        <Bar dataKey="Incomplete" fill="#f87171" />
      </BarChart>
    </ChartContainer>
  );
}
