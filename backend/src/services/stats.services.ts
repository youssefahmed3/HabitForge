import { db } from "../drizzle";
import { habitEntriesTable, habitsTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import dayjs from "dayjs";

export async function getGlobalStats(userId: string) {
  const entries = await db
    .select({
      habitId: habitEntriesTable.habitId,
      completed: habitEntriesTable.completed,
      date: habitEntriesTable.date,
      name: habitsTable.name,
    })
    .from(habitEntriesTable)
    .innerJoin(habitsTable, eq(habitEntriesTable.habitId, habitsTable.id))
    .where(eq(habitsTable.userId, userId));

  const totalTrackedDays = entries.length;
  const totalCompleted = entries.filter(e => e.completed).length;
  const globalCompletionRate = totalTrackedDays > 0
    ? (totalCompleted / totalTrackedDays) * 100
    : 0;

  const habitMap: Record<string, { name: string; total: number; completed: number }> = {};
  const dailyMap: Record<string, number> = {};

  for (const entry of entries) {
    // Aggregate per habit
    if (!habitMap[entry.habitId]) {
      habitMap[entry.habitId] = { name: entry.name, total: 0, completed: 0 };
    }
    habitMap[entry.habitId].total += 1;
    if (entry.completed) habitMap[entry.habitId].completed += 1;

    // Aggregate per day
    const day = dayjs(entry.date).format("YYYY-MM-DD");
    if (!dailyMap[day]) dailyMap[day] = 0;
    if (entry.completed) dailyMap[day] += 1;
  }

  const totalHabits = Object.keys(habitMap).length;

  const habitBreakdown = Object.entries(habitMap).map(([habitId, stats]) => ({
    habitId,
    name: stats.name,
    total: stats.total,
    completed: stats.completed,
    completionRate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 10000) / 100 : 0,
  }));

  const topHabits = [...habitBreakdown]
    .sort((a, b) => b.completionRate - a.completionRate)
    .slice(0, 3);

  const dailyCompletion = Object.entries(dailyMap)
    .sort(([a], [b]) => dayjs(a).isBefore(dayjs(b)) ? -1 : 1)
    .map(([date, completed]) => ({ date, completed }));

  return {
    totalHabits,
    totalTrackedDays,
    totalCompleted,
    globalCompletionRate: Math.round(globalCompletionRate * 100) / 100,
    topHabits: topHabits.map(h => ({
      habitId: h.habitId,
      name: h.name,
      completionRate: h.completionRate
    })),
    habitBreakdown,
    dailyCompletion
  };
}
