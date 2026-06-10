import type { Request, Response } from "express"
import { getVideoById } from "../services/video.services"
import { likeVideoService, unlikeVideoService, hasUserLikedVideoService, getLikedVideosService } from "../services/like.services"

export const likeVideoController = async (req: Request, res: Response) => {
    const videoId = req.params.videoId as string
    const userId = req.userId as string

    try {
        const video = await getVideoById(videoId)

        if (!video) {
            return res.status(404).json({
                success: false,
                error: { code: "NOT_FOUND", message: "Video not found" }
            })
        }

        // Check if already liked
        const alreadyLiked = await hasUserLikedVideoService(userId, videoId)
        if (alreadyLiked) {
            return res.status(409).json({
                success: false,
                error: { code: "ALREADY_LIKED", message: "You have already liked this video" }
            })
        }

        await likeVideoService(userId, videoId)

        return res.status(201).json({
            success: true,
            message: "Video liked successfully"
        })
    } catch (e) {
        console.error(e)
        return res.status(500).json({
            success: false,
            error: { code: "INTERNAL_ERROR", message: (e as Error).message }
        })
    }
}

export const unlikeVideoController = async (req: Request, res: Response) => {
    const videoId = req.params.videoId as string
    const userId = req.userId as string

    try {
        const video = await getVideoById(videoId)

        if (!video) {
            return res.status(404).json({
                success: false,
                error: { code: "NOT_FOUND", message: "Video not found" }
            })
        }

        const hasLiked = await hasUserLikedVideoService(userId, videoId)
        if (!hasLiked) {
            return res.status(409).json({
                success: false,
                error: { code: "NOT_LIKED", message: "You have not liked this video" }
            })
        }

        await unlikeVideoService(userId, videoId)

        return res.json({
            success: true,
            message: "Video unliked successfully"
        })
    } catch (e) {
        console.error(e)
        return res.status(500).json({
            success: false,
            error: { code: "INTERNAL_ERROR", message: (e as Error).message }
        })
    }
}

export const getLikeStatusController = async (req: Request, res: Response) => {
    const videoId = req.params.videoId as string
    const userId = req.userId as string

    try {
        const video = await getVideoById(videoId)

        if (!video) {
            return res.status(404).json({
                success: false,
                error: { code: "NOT_FOUND", message: "Video not found" }
            })
        }

        const isLiked = await hasUserLikedVideoService(userId, videoId)

        return res.json({
            success: true,
            data: { isLiked }
        })
    } catch (e) {
        console.error(e)
        return res.status(500).json({
            success: false,
            error: { code: "INTERNAL_ERROR", message: (e as Error).message }
        })
    }
}

export const getLikedVideosController = async (req: Request, res: Response) => {
    const userId = req.userId as string

    try {
        const videos = await getLikedVideosService(userId)

        return res.json({
            success: true,
            data: videos
        })
    } catch (e) {
        console.error(e)
        return res.status(500).json({
            success: false,
            error: { code: "INTERNAL_ERROR", message: (e as Error).message }
        })
    }
}
