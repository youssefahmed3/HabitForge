import { and, between, eq, sql } from "drizzle-orm";
import { db } from "../drizzle";
import { habitEntriesTable } from "../drizzle/schema";
import dayjs from "dayjs";
import { newHabitEntryInput } from "../dtos/newHabitEntry";
import { v4 as uuidv4 } from 'uuid';
import { updateHabitEntryInput } from "../dtos/updateHabitEntry";



export async function getHabitEntries(habitId: string, range?: string, start?: string, end?: string) {

    let result;

    if (range === "week") {
        const today = dayjs().endOf("day").toISOString(); // e.g., 2025-06-14T23:59:59Z
        const sevenDaysAgo = dayjs().startOf("day").subtract(6, "day").toISOString(); // e.g., 2025-06-08T00:00:00Z

        result = await db
            .select()
            .from(habitEntriesTable)
            .where(
                and(
                    eq(habitEntriesTable.habitId, habitId),
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
                    eq(habitEntriesTable.habitId, habitId),
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
    const today = dayjs().startOf('day').format('YYYY-MM-DD');
    console.log("Today" + today);
    
    const [entry] = await db.select()
        .from(habitEntriesTable)
        .where(and(
            eq(habitEntriesTable.habitId, updatedEntry.habitId),
            eq(habitEntriesTable.date, today)
        ));

    if (!entry) {
        throw new Error("Habit entry not found for that date.");
    }

    const updated = await db.update(habitEntriesTable)
        .set({ completed: !entry.completed })
        .where(eq(habitEntriesTable.id, entry.id));

    if (updated.changes === 0) {
        throw new Error("Failed to update habit entry.");
    }

    return { id: entry.id, completed: !entry.completed };

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