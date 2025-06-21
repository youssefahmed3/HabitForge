import { fromNodeHeaders } from 'better-auth/node';
import * as habitCategoryService from '../services/habitCategory.services';
import { auth } from '../utils/auth';
import { newHabitCategorySchema } from '../dtos/newHabitCategoryInput';
import { Request, Response } from 'express';



export async function getAllHabitCategories(req: Request, res: Response) {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });
    try {
        const result = await habitCategoryService.getAllHabitCategories(session!.user.id);
        res.status(200).json({ result });
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
}

export async function createNewHabitCategory(req: Request, res: Response) {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        const parseResult = newHabitCategorySchema.safeParse(req.body);

        if (!parseResult.success) {
            res.status(400).json({ error: parseResult.error.format() });
            return;
        }

        const newCategory = parseResult.data;

        const habit = await habitCategoryService.createNewHabitCategory(newCategory, session!.user.id);
        res.status(200).json(habit);
    } catch (error: any) {
        if (error.message === "UNIQUE constraint failed: habit_categories.user_id, habit_categories.name") {
            res.status(409).json({ error: "Category with this name already exists" });
        }
        res.status(404).json({ error: error.message });


    }
}

export async function updateHabitCategory(req: Request, res: Response) {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        const categoryId = req.params.id;
        console.log(categoryId);

        const parseResult = newHabitCategorySchema.safeParse(req.body);

        if (!parseResult.success) {
            res.status(400).json({ error: parseResult.error.format() });
            return;
        }

        const updatedCategoryData = parseResult.data;

        const category = await habitCategoryService.updateHabitCategory(updatedCategoryData, session!.user.id, categoryId);
        res.status(200).json(category);
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
}

export async function deleteHabitCategory(req: Request, res: Response) {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        const categoryId = req.params.id;
        console.log(categoryId);


        const category = await habitCategoryService.deleteHabitCategory(session!.user.id, categoryId);
        res.status(200).json(category);
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }

}