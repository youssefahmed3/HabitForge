import { z } from "zod";

export const updateHabitEntrySchema = z.object({
    habitId: z.string().min(2, { message: "Habit id is required" }),
});

export type updateHabitEntryInput = z.infer<typeof updateHabitEntrySchema>; 