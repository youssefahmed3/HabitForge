import { and, between, eq, inArray, sql } from "drizzle-orm";
import { db } from "../drizzle";
import { habitEntriesTable } from "../drizzle/schema";
import dayjs from "dayjs";
import { newHabitEntryInput } from "../dtos/newHabitEntry";
import { v4 as uuidv4 } from 'uuid';
import { updateHabitEntryInput } from "../dtos/updateHabitEntry";



export async function getHabitEntries( habitIds: string[], range?: string, start?: string, end?: string) {
    if (!habitIds.length) return [];

    let result;

    if (range === "week") {
        const today = dayjs().endOf("day").toISOString();
        const sevenDaysAgo = dayjs().startOf("day").subtract(6, "day").toISOString();

        result = await db
            .select()
            .from(habitEntriesTable)
            .where(
                and(
                    inArray(habitEntriesTable.habitId, habitIds),
                    between(habitEntriesTable.date, sevenDaysAgo, today)
                )
            )
            .orderBy(sql`date DESC`);

    } else if (start && end) {
        result = await db
            .select()
            .from(habitEntriesTable)
            .where(
                and(
                    inArray(habitEntriesTable.habitId, habitIds), /// This is Really Magic is works like giving all teh habitids and it will return all the entries
                    between(habitEntriesTable.date, start, end)
                )
            )
            .orderBy(sql`date DESC`);
    } else {
        throw new Error("Must provide either 'range=week' or both 'start' and 'end' query parameters.");
    }

    return result;
}


export async function createNewHabitEntry(newHabitEntry: newHabitEntryInput) {

    const result = await db.insert(habitEntriesTable).values({
        id: uuidv4(),
        date: dayjs().format('YYYY-MM-DD'),
        ...newHabitEntry
    });

    if (result.changes === 0) {
        throw new Error("Failed to create habit entry.");
    }

    return { success: true };
}


export async function toggleHabitEntry(updatedEntry: updateHabitEntryInput) {
  const today = dayjs().startOf("day").format("YYYY-MM-DD");

  const [entry] = await db
    .select()
    .from(habitEntriesTable)
    .where(
      and(
        eq(habitEntriesTable.habitId, updatedEntry.habitId),
        eq(habitEntriesTable.date, today)
      )
    );

  if (!entry) {
    // Create new entry (assume completed = true)
    const [newEntry] = await db
      .insert(habitEntriesTable)
      .values({
        id: uuidv4(),
        habitId: updatedEntry.habitId,
        date: today,
        completed: true,
      })
      .returning();

    return {
      id: newEntry.id,
      completed: newEntry.completed,
      message: "Entry created",
    };
  }

  // Toggle the existing one
  const [updated] = await db
    .update(habitEntriesTable)
    .set({ completed: !entry.completed })
    .where(eq(habitEntriesTable.id, entry.id))
    .returning();

  return {
    id: updated.id,
    completed: updated.completed,
    message: "Entry updated",
  };
}

export async function deleteHabitEntryById(habitEntryId: string) {
    const result = await db
        .delete(habitEntriesTable)
        .where(eq(habitEntriesTable.id, habitEntryId));

    if (result.changes === 0) {
        throw new Error("Failed to delete habit entry or entry not found.");
    }

    return { success: true };
}