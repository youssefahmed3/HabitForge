import { fromNodeHeaders } from "better-auth/node";
import { Request, Response } from "express";
import { auth } from "../utils/auth";
import * as statsService from "../services/stats.services";

export async function globalStats(req: Request, res: Response) {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });


        const stats = await statsService.getGlobalStats(session!.user.id);
        res.status(200).json(stats);
        return;
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}