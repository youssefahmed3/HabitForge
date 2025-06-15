import { and, eq } from "drizzle-orm";
import { db } from "../drizzle";
import { habitCategoriesTable } from "../drizzle/schema";
import { newHabitCategoryInput } from "../dtos/newHabitCategoryInput";
import { v4 as uuidv4 } from 'uuid';

export async function getAllHabitCategories() {
    const result = await db.select().from(habitCategoriesTable);

    return result;
}

export async function createNewHabitCategory(newCategory: newHabitCategoryInput, userId: string) {
    const result = await db.insert(habitCategoriesTable).values({
        id: uuidv4(),
        name: newCategory.name,
        description: newCategory.description,
        userId: userId
    });

    if (result.changes === 0) {
        throw new Error("Failed to create habit category.");
    }

    return { success: true };
}

export async function updateHabitCategory(updatedCategoryData: newHabitCategoryInput, userId: string, categoryId: string) {
    const result = await db.update(habitCategoriesTable).set(updatedCategoryData).where(and(eq(habitCategoriesTable.userId, userId), eq(habitCategoriesTable.id, categoryId)));

    if (result.changes === 0) {
        throw new Error("Category is not found or you don't have permission to Update it.");
    }

    return { success: true };
}

export async function deleteHabitCategory(userId: string, categoryId: string) {
    const result = await db.delete(habitCategoriesTable).where(and(eq(habitCategoriesTable.userId, userId), eq(habitCategoriesTable.id, categoryId)));

    if (result.changes === 0) {
        throw new Error("Category not found or you don't have permission to delete it.");
    }

    return { success: true };

}