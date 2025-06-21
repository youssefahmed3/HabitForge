import { Request, Response } from 'express';
import * as habitEntryService from '../services/habitEntry.services';
import { auth } from '../utils/auth';
import { fromNodeHeaders } from 'better-auth/node';
import { newHabitEntrySchema } from '../dtos/newHabitEntry';
import { updateHabitEntrySchema } from '../dtos/updateHabitEntry';
import dayjs from 'dayjs';


export async function getHabitEntries(req: Request, res: Response) {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });
        
        let habitIds = req.query.habitId;

        // Normalize to array
        if (!habitIds) {
            res.status(400).json({ error: "Missing habitId parameter" });
            return;
        }

        if (typeof habitIds === "string") {
            habitIds = [habitIds];
        }

        const { range, start, end } = req.query;

        const result = await habitEntryService.getHabitEntries(
            habitIds as string[],
            typeof range === "string" ? range : undefined,
            typeof start === "string" ? start : undefined,
            typeof end === "string" ? end : undefined
        );

        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}


export async function createNewHabitEntry(req: Request, res: Response) {
    try {
        const parseResult = newHabitEntrySchema.safeParse(req.body);

        if (!parseResult.success) {
            res.status(400).json({ error: parseResult.error.format() });
            return;
        }

        const newHabitEntry = parseResult.data;

        const entry = await habitEntryService.createNewHabitEntry(newHabitEntry);
        res.status(200).json(entry);
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }

}


export async function toggleHabitEntry(req: Request, res: Response) {
    try {
        const parseResult = updateHabitEntrySchema.safeParse(req.body);

        if (!parseResult.success) {
            res.status(400).json({ error: parseResult.error.format() });
            return;
        }


        const updatedHabitEntry = parseResult.data;

        const updatedEntry = await habitEntryService.toggleHabitEntry(updatedHabitEntry);
        res.status(200).json(updatedEntry);
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
}

export async function deleteHabitEntryById(req: Request, res: Response) {
    try {
        const { id } = req.params;

        if (!id || typeof id !== 'string') {
            res.status(400).json({ error: "Invalid habit entry ID" });
            return;
        }

        const result = await habitEntryService.deleteHabitEntryById(id);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
}