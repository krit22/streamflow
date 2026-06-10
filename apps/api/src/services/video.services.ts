import prisma from "../db";

export const createVideoService = async (channelId: string, title: string, description: string, uploadUrl: string, thumbnailUrl: string) => {
    const video = await prisma.video.create({
        data: {
            channelId,
            title,
            description,
            videoUrl: uploadUrl,
            thumbnailUrl,
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

export const getVideosService = async (limit: number, cursor?: string) => {
    const videos = await prisma.video.findMany({
        take: limit + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        where: {
            status: "UPLOADED"
        },
        include: {
            channel: true
        },
        orderBy: { createdAt: "desc" }
    })

    const hasMore = videos.length > limit
    const page = hasMore ? videos.slice(0, limit) : videos
    const nextCursor = hasMore ? page[page.length - 1]!.id : null

    return { videos: page, nextCursor }
}

export const updateVideoService = async (
    videoId: string,
    data: { title?: string | undefined; description?: string | undefined; type?: "PUBLIC" | "PRIVATE" | "LINK_ONLY" | undefined; thumbnailUrl?: string | undefined }
) => {
    // Build the update object only with defined values to satisfy Prisma's exactOptionalPropertyTypes
    const prismaData: {
        title?: string
        description?: string
        type?: "PUBLIC" | "PRIVATE" | "LINK_ONLY"
        thumbnailUrl?: string
    } = {}
    if (data.title !== undefined) prismaData.title = data.title
    if (data.description !== undefined) prismaData.description = data.description
    if (data.type !== undefined) prismaData.type = data.type
    if (data.thumbnailUrl !== undefined) prismaData.thumbnailUrl = data.thumbnailUrl

    return prisma.video.update({
        where: { id: videoId },
        data: prismaData
    })
}

export const deleteVideoService = async (videoId: string) => {
    return prisma.video.delete({
        where: { id: videoId }
    })
}

export const incrementViewCountService = async (videoId: string) => {
    return prisma.video.update({
        where: { id: videoId },
        data: { viewsCount: { increment: 1 } }
    })
}