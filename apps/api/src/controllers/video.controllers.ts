import { initalizeVideoUploadSchema, updateVideoSchema } from "@streamflow/validation";
import type { Request, Response } from "express";
import { getChannelService } from "../services/channel.services";
import { createClient } from '@supabase/supabase-js'
import { createVideoService, getVideoById, getVideosService, updateVideoStatus, updateVideoService, deleteVideoService, incrementViewCountService } from "../services/video.services";
import { recordViewHistoryService, hasUserViewedVideoService } from "../services/viewHistory.services";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!)

export const initalizeVideoUploadController = async (req: Request, res: Response) => {

    const { channelId, title, description, contentType, thumbnailContentType } = req.body;

    //1. validate the request body using zod
    const result = initalizeVideoUploadSchema.safeParse({
        channelId,
        title,
        description,
        contentType,
        thumbnailContentType
    })

    if (!result.success) {
        return res.status(400).json({
            success: false,
            "error": {
                code: "VALIDATION_ERROR",
                "message": "Invalid request body",
                "details": result.error.issues
            }
        })
    }

    try {
        // 2. Check if the channel exists and the user owns it
        const channelDetails = await getChannelService(channelId)

        if (!channelDetails || channelDetails.userId !== req.userId) {
            return res.status(403).json({
                success: false,
                error: {
                    code: "PERMISSION_DENIED",
                    message: "You do not have permission to upload videos to this channel.",
                }
            })
        }

        // 3. Validate supported file formats
        const supportedVideoTypes = ["video/mp4"];
        if (!supportedVideoTypes.includes(contentType)) {
            return res.status(400).json({
                success: false,
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Invalid video content type. Only video/mp4 is supported."
                }
            })
        }

        // 4. Generate unique filenames for storage
        const videoFilename = `${Math.floor(1000000000 + Math.random() * 9000000000)}.mp4`;
        const thumbFilename = `${Math.floor(1000000000 + Math.random() * 9000000000)}.png`;

        // 5. Generate signed upload URLs from Supabase in parallel
        const [videoUploadData, thumbUploadData] = await Promise.all([
            supabase.storage.from('videos').createSignedUploadUrl(videoFilename),
            supabase.storage.from('videos').createSignedUploadUrl(thumbFilename)
        ]);

        if (videoUploadData.error) throw videoUploadData.error;
        if (thumbUploadData.error) throw thumbUploadData.error;

        // 6. Construct public URLs for database storage
        const storageBaseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/videos`;
        const videoUrl = `${storageBaseUrl}/${videoFilename}`;
        const thumbnailUrl = `${storageBaseUrl}/${thumbFilename}`;

        // 7. Create pending video record in database
        const video = await createVideoService(
            channelDetails.id, 
            title, 
            description, 
            videoUrl, 
            thumbnailUrl
        );

        // 8. Return signed URLs and metadata to client
        return res.json({
            success: true,
            data: {
                videoId: video.id,
                videoUploadUrl: videoUploadData.data?.signedUrl,
                videoUrl,
                thumbnailUploadUrl: thumbUploadData.data?.signedUrl,
                thumbnailUrl
            }
        });

    } catch (e) {
        console.error(e)
        return res.status(500).json({
            success: false,
            "error": {
                "code": "INTERNAL_ERROR",
                "message": (e as Error).message
            }
        })
    }
}

export const finalizeVideoUploadController = async (req: Request, res: Response) => {
    const videoId = req.params.videoId as string

    //1. find if the video exists
    const video = await getVideoById(videoId)

    if (!video) {
        return res.status(404).json({
            success: false,
            error: {
                code: "NOT_FOUND",
                message: "Video not found"
            }
        })
    }

    //2. verify if the video is owned by the user
    if (video.channel.userId !== req.userId) {
        return res.status(403).json({
            success: false,
            error: {
                code: "PERMISSION_DENIED",
                message: "You do not have permission to access this video"
            }
        })
    }

    //3. update the video status to UPLOADED
    try {
        await updateVideoStatus(videoId, "UPLOADED")

        return res.json({
            success: true,
            message: "Video finalized successfully"
        })
    } catch (e) {
        console.error(e)
        return res.status(500).json({
            success: false,
            "error": {
                "code": "INTERNAL_ERROR",
                "message": (e as Error).message
            }
        })
    }
}

export const getVideoController = async (req: Request, res: Response) => {
    const videoId = req.params.videoId as string

    try {
        const video = await getVideoById(videoId)



        if (!video) {
            return res.status(404).json({
                success: false,
                error: {
                    code: "NOT_FOUND",
                    message: "Video not found"
                }
            })
        }


        if (video.status !== "UPLOADED") {
            return res.status(403).json({
                success: false,
                error: {
                    code: "VIDEO_UNAVAILABLE",
                    message: "Video is not available"
                }
            })
        }

        return res.json({
            success: true,
            data: video
        })
    } catch (e) {
        console.error(e)
        return res.status(500).json({
            success: false,
            "error": {
                "code": "INTERNAL_ERROR",
                "message": (e as Error).message
            }
        })
    }
}

export const getVideosController = async (req: Request, res: Response) => {

    try {
        const limit = Number(req.query.limit) || 10;
        const cursor = req.query.cursor as string;

        const { videos, nextCursor } = await getVideosService(limit, cursor);

        return res.json({
            success: true,
            data: {
                videos,
                nextCursor
            }
        })
    } catch (e) {
        console.error(e)
        return res.status(500).json({
            success: false,
            "error": {
                "code": "INTERNAL_ERROR",
                "message": (e as Error).message
            }
        })
    }
}

export const updateVideoController = async (req: Request, res: Response) => {
    const videoId = req.params.videoId as string

    const result = updateVideoSchema.safeParse(req.body)
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

        if (video.channel.userId !== req.userId) {
            return res.status(403).json({
                success: false,
                error: { code: "PERMISSION_DENIED", message: "You do not have permission to edit this video" }
            })
        }

        // Strip undefined keys to satisfy exactOptionalPropertyTypes
        const updatePayload = Object.fromEntries(
            Object.entries(result.data).filter(([, v]) => v !== undefined)
        ) as { title?: string; description?: string; type?: "PUBLIC" | "PRIVATE" | "LINK_ONLY" }

        const updated = await updateVideoService(videoId, updatePayload)

        return res.json({
            success: true,
            data: updated
        })
    } catch (e) {
        console.error(e)
        return res.status(500).json({
            success: false,
            error: { code: "INTERNAL_ERROR", message: (e as Error).message }
        })
    }
}

export const deleteVideoController = async (req: Request, res: Response) => {
    const videoId = req.params.videoId as string

    try {
        const video = await getVideoById(videoId)

        if (!video) {
            return res.status(404).json({
                success: false,
                error: { code: "NOT_FOUND", message: "Video not found" }
            })
        }

        if (video.channel.userId !== req.userId) {
            return res.status(403).json({
                success: false,
                error: { code: "PERMISSION_DENIED", message: "You do not have permission to delete this video" }
            })
        }

        await deleteVideoService(videoId)

        return res.json({
            success: true,
            message: "Video deleted successfully"
        })
    } catch (e) {
        console.error(e)
        return res.status(500).json({
            success: false,
            error: { code: "INTERNAL_ERROR", message: (e as Error).message }
        })
    }
}

export const incrementViewCountController = async (req: Request, res: Response) => {
    const videoId = req.params.videoId as string

    try {
        const video = await getVideoById(videoId)

        if (!video) {
            return res.status(404).json({
                success: false,
                error: { code: "NOT_FOUND", message: "Video not found" }
            })
        }

        if (video.status !== "UPLOADED") {
            return res.status(403).json({
                success: false,
                error: { code: "VIDEO_UNAVAILABLE", message: "Video is not available" }
            })
        }

        let shouldIncrement = false;

        if (req.userId) {
            // Authenticated user tracking
            const alreadyViewed = await hasUserViewedVideoService(req.userId, videoId);
            if (!alreadyViewed) {
                shouldIncrement = true;
            }
            await recordViewHistoryService(req.userId, videoId);
        } else {
            // Guest session tracking via cookie
            let viewedVideos: string[] = [];
            try {
                viewedVideos = req.cookies.viewed_videos ? JSON.parse(req.cookies.viewed_videos) : [];
            } catch (e) {
                viewedVideos = [];
            }
            
            if (!viewedVideos.includes(videoId)) {
                shouldIncrement = true;
                const updatedViewedVideos = [...viewedVideos, videoId];
                res.cookie("viewed_videos", JSON.stringify(updatedViewedVideos), {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24, // 24 hours
                    sameSite: "lax",
                });
            }
        }

        if (shouldIncrement) {
            await incrementViewCountService(videoId);
        }

        return res.json({
            success: true,
            message: "View processed"
        })
    } catch (e) {
        console.error(e)
        return res.status(500).json({
            success: false,
            error: { code: "INTERNAL_ERROR", message: (e as Error).message }
        })
    }
}
