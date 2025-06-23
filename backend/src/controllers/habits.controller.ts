import { fromNodeHeaders } from 'better-auth/node';
import { newHabitSchema } from '../dtos/newHabitInput';
import * as habitsService from '../services/habits.services';
import { auth } from '../utils/auth';
import { Request, Response } from 'express';
import { updateHabitSchema } from '../dtos/updateHabit';



export async function getAllHabits(req: Request, res: Response) {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });



    const categoryId = req.query.categoryId as string | undefined;

    const habits = await habitsService.getAllHabits(session?.user.id as string, categoryId);
    res.status(200).json(habits);
}


export async function createNewHabit(req: Request, res: Response) {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        const parseResult = newHabitSchema.safeParse(req.body);

        if (!parseResult.success) {
            res.status(400).json({ error: parseResult.error.format() });
            return;
        }

        const newHabit = parseResult.data;

        const habit = await habitsService.createNewHabit(newHabit, session!.user.id);
        res.status(200).json(habit);
    } catch (error: any) {
        if (error.message === "UNIQUE constraint failed: habits.name, habits.user_id") {
            res.status(409).json({ error: "Habit with this name already exists" });
        }
        res.status(404).json({ error: error.message });



    }
}


export async function updateHabit(req: Request, res: Response) {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        const habitId = req.params.id;
        console.log(habitId);

        const parseResult = updateHabitSchema.safeParse(req.body);

        if (!parseResult.success) {
            res.status(400).json({ error: parseResult.error.format() });
            return;
        }

        const updatedHabit = parseResult.data;

        const habit = await habitsService.updateHabit(updatedHabit, session!.user.id, habitId);
        res.status(200).json(habit);
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
}


export async function deleteHabit(req: Request, res: Response) {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        const habitId = req.params.id;
        console.log(habitId);

        const habit = await habitsService.deleteHabit(session!.user.id, habitId);
        res.status(200).json(habit);
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
}


export async function getHabitStats(req: Request, res: Response) {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: "Missing habit ID" });
            return;
        }

        const stats = await habitsService.getHabitStats(id);
        res.status(200).json(stats);
        return;
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}



export async function getAllHabitStats(req: Request, res: Response) {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        const stats = await habitsService.getAllHabitStats(session!.user.id);
        res.status(200).json(stats);
    } catch (error: any) {
        console.error("Error in getAllHabitStats:", error);
        res.status(500).json({ error: error.message });
    }
}