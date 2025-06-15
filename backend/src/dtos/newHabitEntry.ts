import { z } from "zod";

export const newHabitEntrySchema = z.object({
    habitId: z.string().min(2, { message: "Habit id is required" }),
    completed: z.boolean().default(false),
});

export type newHabitEntryInput = z.infer<typeof newHabitEntrySchema>; 