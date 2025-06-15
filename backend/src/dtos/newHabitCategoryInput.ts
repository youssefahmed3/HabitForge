import { z } from "zod";

export const newHabitCategorySchema = z.object({
    name: z.string().min(2, { message: "Habit name is required" }),
    description: z.string().optional(),
    
});

export type newHabitCategoryInput = z.infer<typeof newHabitCategorySchema>;
