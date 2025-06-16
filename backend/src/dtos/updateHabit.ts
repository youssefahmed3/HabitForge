import { z } from "zod";

export const updateHabitSchema = z.object({
    name: z.string().optional()/* .min(2, { message: "Habit name is required" }) */,
    description: z.string().optional(),
    categoryName: z.string().optional(),

});


export type updateHabitInput = z.infer<typeof updateHabitSchema>;