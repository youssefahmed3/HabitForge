import { db } from "../drizzle";
import { habitEntriesTable, habitsTable } from "../drizzle/schema";
import { newHabitInput } from "../dtos/newHabitInput";
import { v4 as uuidv4 } from 'uuid';
import { eq, and, sql } from "drizzle-orm";
import dayjs from "dayjs";

export async function getAllHabits(userId: string, categoryId: string | undefined) {
    let habits;

    if (categoryId) {
        habits = await db.select().
            from(habitsTable).
            where(
                and(
                    eq(habitsTable.userId, userId),
                    eq(habitsTable.categoryId, categoryId)
                )
            ).
            orderBy(sql`created_at DESC`);
    }
    else {
        habits = await db.select().from(habitsTable).where(eq(habitsTable.userId, userId));
    }

    return habits;
}

export async function createNewHabit(newHabit: newHabitInput, userId: string) {
    const result = await db.insert(habitsTable).values({
        id: uuidv4(),
        name: newHabit.name,
        description: newHabit.description,
        userId: userId,
        // categoryId: newHabit.categoryId
    });

    if (result.changes === 0) {
        throw new Error("Failed to create habit.");
    }

    return { success: true };
}

export async function updateHabit(newHabit: newHabitInput, userId: string, habitId: string) {
    const result = await db.update(habitsTable).set(newHabit).where(and(eq(habitsTable.userId, userId), eq(habitsTable.id, habitId)));

    if (result.changes === 0) {
        throw new Error("Habit not found or you don't have permission to Update it.");
    }

    return { success: true };
}

export async function deleteHabit(userId: string, habitId: string) {
    const result = await db.delete(habitsTable).where(and(eq(habitsTable.userId, userId), eq(habitsTable.id, habitId)));

    if (result.changes === 0) {
        throw new Error("Habit not found or you don't have permission to delete it.");
    }

    return { success: true };
}

export async function getHabitStats(habitId: string) {
    const entries = await db
        .select()
        .from(habitEntriesTable)
        .where(eq(habitEntriesTable.habitId, habitId));

    const totalDaysTracked = entries.length;
    const totalCompleted = entries.filter(e => e.completed).length;
    const completionRate = totalDaysTracked > 0 ? (totalCompleted / totalDaysTracked) * 100 : 0;

    // Sort by date
    const sorted = entries
        .filter(e => e.date !== null)
        .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let streak = 0;
    let lastDate = null;

    for (const entry of sorted) {
        if (!entry.completed) {
            streak = 0;
            continue;
        }

        if (!lastDate || dayjs(entry.date).diff(dayjs(lastDate), 'day') === 1) {
            streak += 1;
        } else {
            streak = 1;
        }

        longestStreak = Math.max(longestStreak, streak);
        lastDate = entry.date;
    }

    currentStreak = streak;

    return {
        habitId,
        totalDaysTracked,
        totalCompleted,
        completionRate: Math.round(completionRate * 100) / 100,
        currentStreak,
        longestStreak
    };
}