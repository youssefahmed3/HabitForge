import { db } from "../drizzle";
import { habitEntriesTable, habitsTable } from "../drizzle/schema";
import {eq, sql} from "drizzle-orm";

export async function getGlobalStats(userId: string) {
  const entries = await db
    .select({
      habitId: habitEntriesTable.habitId,
      completed: habitEntriesTable.completed
    })
    .from(habitEntriesTable)
    .innerJoin(habitsTable, eq(habitEntriesTable.habitId, habitsTable.id))
    .where(eq(habitsTable.userId, userId));

  const totalTrackedDays = entries.length;
  const totalCompleted = entries.filter(e => e.completed).length;
  const globalCompletionRate = totalTrackedDays > 0
    ? (totalCompleted / totalTrackedDays) * 100
    : 0;

  const uniqueHabitIds = new Set(entries.map(e => e.habitId));
  const totalHabits = uniqueHabitIds.size;

  const habitMap: Record<string, { total: number; completed: number }> = {};

  for (const entry of entries) {
    if (!habitMap[entry.habitId]) {
      habitMap[entry.habitId] = { total: 0, completed: 0 };
    }
    habitMap[entry.habitId].total += 1;
    if (entry.completed) habitMap[entry.habitId].completed += 1;
  }

  const topHabits = Object.entries(habitMap)
    .map(([habitId, stats]) => ({
      habitId,
      completionRate: (stats.completed / stats.total) * 100,
    }))
    .sort((a, b) => b.completionRate - a.completionRate)
    .slice(0, 3);

  return {
    totalHabits,
    totalTrackedDays,
    totalCompleted,
    globalCompletionRate: Math.round(globalCompletionRate * 100) / 100,
    topHabits: topHabits.map(h => ({
      habitId: h.habitId,
      completionRate: Math.round(h.completionRate * 100) / 100
    }))
  };
}