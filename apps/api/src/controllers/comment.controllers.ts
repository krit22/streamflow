import type { Request, Response } from "express"
import { createCommentSchema } from "@streamflow/validation"
import { getVideoById } from "../services/video.services"
import {
    createCommentService,
    getCommentsByVideoService,
    deleteCommentService,
    getCommentByIdService
} from "../services/comment.services"

export const createCommentController = async (req: Request, res: Response) => {
    const videoId = req.params.videoId as string
    const userId = req.userId as string

    const result = createCommentSchema.safeParse(req.body)
    if (!result.success) {
        return res.status(400).json({
            success: false,
            error: {
                code: "VALIDATION_ERROR",
                message: "Invalid request body",
                details: result.error.issues
            }
        })
    }

    try {
        const video = await getVideoById(videoId)
        if (!video) {
            return res.status(404).json({
                success: false,
                error: { code: "NOT_FOUND", message: "Video not found" }
            })
        }

        const comment = await createCommentService(videoId, userId, result.data.commentBody)

        return res.status(201).json({
            success: true,
            data: comment
        })
    } catch (e) {
        console.error(e)
        return res.status(500).json({
            success: false,
            error: { code: "INTERNAL_ERROR", message: (e as Error).message }
        })
    }
}

export const getCommentsController = async (req: Request, res: Response) => {
    const videoId = req.params.videoId as string
    const limit = Number(req.query.limit) || 20
    const cursor = req.query.cursor as string | undefined

    try {
        const video = await getVideoById(videoId)
        if (!video) {
            return res.status(404).json({
                success: false,
                error: { code: "NOT_FOUND", message: "Video not found" }
            })
        }

        const comments = await getCommentsByVideoService(videoId, limit, cursor)

        return res.json({
            success: true,
            data: comments
        })
    } catch (e) {
        console.error(e)
        return res.status(500).json({
            success: false,
            error: { code: "INTERNAL_ERROR", message: (e as Error).message }
        })
    }
}

export const deleteCommentController = async (req: Request, res: Response) => {
    const videoId = req.params.videoId as string
    const commentId = req.params.commentId as string
    const userId = req.userId as string

    try {
        const comment = await getCommentByIdService(commentId)

        if (!comment) {
            return res.status(404).json({
                success: false,
                error: { code: "NOT_FOUND", message: "Comment not found" }
            })
        }

        // Only the comment author can delete it
        if (comment.userId !== userId) {
            return res.status(403).json({
                success: false,
                error: { code: "PERMISSION_DENIED", message: "You do not have permission to delete this comment" }
            })
        }

        // Guard: comment must belong to the video in the URL
        if (comment.videoId !== videoId) {
            return res.status(400).json({
                success: false,
                error: { code: "BAD_REQUEST", message: "Comment does not belong to this video" }
            })
        }

        await deleteCommentService(commentId)

        return res.json({
            success: true,
            message: "Comment deleted successfully"
        })
    } catch (e) {
        console.error(e)
        return res.status(500).json({
            success: false,
            error: { code: "INTERNAL_ERROR", message: (e as Error).message }
        })
    }
}
