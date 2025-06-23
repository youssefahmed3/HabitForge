"use client";
import React, { useEffect, useMemo, useState } from "react";

import { Separator } from "@/components/ui/separator";

import Header from "@/components/header/Header";

import AddHabitDialog from "./_components/AddHabitDialog";
import AddHabitCategoryDialog from "./_components/AddHabitCategoryDialog";
import Column from "./_components/Column/Column";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import StatsCard from "@/components/statsCard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Flame, Shell, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useCategories } from "@/context/CategoriesContext";
import { useUncategorizedHabits } from "@/context/UncategorizedHabitsContext";
import { useHabitEntry } from "@/context/HabitEntryContext";
import { useAnalytics } from "@/context/AnalyticsContext";

function Page() {
  const { habits, reloadUncategorizedHabits } = useUncategorizedHabits();
  const { categories, reloadCategories } = useCategories();
  const { reloadEntries, habitEntries } = useHabitEntry();
  const { longestStreak } = useAnalytics();

  useEffect(() => {
    const allHabitIds = [
      ...habits.map((h) => h.id),
      ...categories.flatMap((c) => c.habits.map((h) => h.id)),
    ];
    if (allHabitIds.length > 0) {
      reloadEntries(allHabitIds);
    }
  }, [habits, categories]);

  console.log("Categories from context:", categories);
  console.log("reloadUncategorizedHabits from context:", habits);

  const totalHabits = useMemo(() => {
    const categorizedCount = categories.reduce((total, category) => {
      return total + (category.habits?.length || 0);
    }, 0);
    return categorizedCount + habits.length;
  }, [categories, habits]);

  const totalCategories = categories.length;

  const completedToday = useMemo(() => {
    return Object.values(habitEntries).filter((completed) => completed).length;
  }, [habitEntries]);

  const todayTotalTrackedHabits = totalHabits;

  const todayProgress = useMemo(() => {
    return todayTotalTrackedHabits === 0
      ? 0
      : (completedToday / todayTotalTrackedHabits) * 100;
  }, [completedToday, todayTotalTrackedHabits]);

  return (
    <div className="bg-custom-background text-custom-text flex flex-col gap-2 px-6">
      {/* Header */}
      <div>
        <Header />
        <Separator className="my-2 h-[20px]" />
      </div>

      {/* start of overview stats */}
      <div className="flex gap-6 items-center justify-around">
        <Card className="w-[250px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Progress
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedToday}/{totalHabits}
            </div>
            <Progress value={todayProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round(todayProgress)}% completed
            </p>
          </CardContent>
        </Card>

        <StatsCard
          title="Longest Streak"
          data={longestStreak}
          description="Days"
          icon={<Flame />}
        />
        <StatsCard
          title="Active Habits"
          data={totalHabits}
          description="Habits Tracked"
          icon={<Shell />}
        />
        <StatsCard
          title="Categories"
          data={totalCategories}
          description="Active Categories"
          icon={<Book />}
        />
      </div>
      <Separator className="my-2 h-[20px]" />

      {/* Start of Habit Categories */}

      <section className="flex flex-col px-3 gap-2">
        <div className="flex justify-between">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold">Habit Categories</h2>
            <p className="text-sm">
              Drag habits between categories to organize them
            </p>
          </div>
          <div className="flex gap-2 items-center ">
            <AddHabitCategoryDialog />
            <AddHabitDialog />
          </div>
        </div>

        <ScrollArea className="rounded-md border">
          <div className="flex gap-4 m-2">
            {/* Uncategorized Column */}
            <Column
              key="uncategorized"
              categoryTitle="Uncategorized"
              habits={habits}
            />

            {/* Categorized Columns */}
            {categories.map((column: any) => (
              <Column
                key={column.id}
                categoryTitle={column.name}
                habits={column.habits}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>
    </div>
  );
}

export default Page;
