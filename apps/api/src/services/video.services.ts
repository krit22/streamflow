import prisma from "../db";

export const createVideoService = async (channelId: string, title: string, description: string, uploadUrl: string) => {
    const video = await prisma.video.create({
        data: {
            channelId,
            title,
            description,
            videoUrl: uploadUrl,
            status: "PENDING",
        }
    })
    return video
}

export const getVideoById = async (videoId: string) => {
    const video = await prisma.video.findUnique({
        where: {
            id: videoId
        },
        include: {
            channel: true
        }
    })
    return video
}

export const updateVideoStatus = async (videoId: string, status: "UPLOADED" | "UPLOADING" | "FAILED" | "PENDING") => {
    const video = await prisma.video.update({
        where: {
            id: videoId
        },
        data: {
            status
        }
    })
    return video
}