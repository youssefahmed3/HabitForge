"use client";

import Header from "@/components/header/Header";
import StatsCard from "@/components/statsCard/StatsCard";
import { ExampleChart } from "@/components/testChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartTooltip } from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarCheck, Flame, Percent, Shell } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#4ade80", "#60a5fa", "#facc15", "#f87171", "#a78bfa"];

type OverviewStats = {
  totalHabits: number;
  totalTrackedDays: number;
  totalCompleted: number;
  globalCompletionRate: number;
  topHabits: { habitId: string; name: string; completionRate: number }[];
  habitBreakdown: {
    habitId: string;
    name: string;
    total: number;
    completed: number;
    completionRate: number;
  }[];
  dailyCompletion: { date: string; completed: number }[];
};

const Page = () => {
  const [data, setData] = useState<OverviewStats | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/stats/overview", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-custom-background text-custom-text flex flex-col gap-4 px-6">
      {/* Header */}
      <div>
        <Header />
        <Separator className="my-2 h-[20px]" />
      </div>

      {/* Summary Cards */}
      <div className="flex justify-between items-center">
        <StatsCard
          title="Total Habits"
          data={data.totalHabits}
          description="Habits"
          icon={<Shell />}
        />

        <StatsCard
          title="Tracked Days"
          data={data.totalTrackedDays}
          description="Days"
          icon={<CalendarCheck />}
        />

        <StatsCard
          title="Completed"
          data={data.totalCompleted}
          description="Habits"
          icon={<Flame />}
        />

        <StatsCard
          title="Completion Rate"
          data={data.globalCompletionRate}
          description="%"
          icon={<Percent />}
        />
      </div>

      <div className="flex flex-col gap-4">
        {/* Top Habits List */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Top Habits</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {(data.topHabits ?? []).map((habit) => (
                <li
                  key={habit.habitId}
                  className="flex justify-between border p-3 rounded-xl"
                >
                  <span className="font-medium">{habit.name}</span>
                  <span className="text-muted-foreground">
                    {habit.completionRate}%
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <div className="flex justify-between items-center gap-">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Habit Completion Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.habitBreakdown ?? []}
                    dataKey="completionRate"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {(data.habitBreakdown ?? []).map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* LineChart - Daily Completions */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Daily Completions</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.dailyCompletion ?? []}>
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
