import type { Request, Response } from "express";
import { getUserViewHistoryService } from "../services/viewHistory.services";

export const getMyViewHistoryController = async (req: Request, res: Response) => {
    try {
        const limit = Number(req.query.limit) || 12;
        const cursor = req.query.cursor as string | undefined;

        const { videos, nextCursor } = await getUserViewHistoryService(
            req.userId as string,
            limit,
            cursor,
        );

        return res.json({
            success: true,
            data: { videos, nextCursor },
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            success: false,
            error: { code: "INTERNAL_ERROR", message: (e as Error).message },
        });
    }
};
