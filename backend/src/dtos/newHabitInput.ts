import { z } from "zod";

export const newHabitSchema = z.object({
    name: z.string().min(2, { message: "Habit name is required" }),
    description: z.string().optional(),
    categoryName: z.string().optional(),

});

export type newHabitInput = z.infer<typeof newHabitSchema>;