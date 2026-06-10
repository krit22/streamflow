import prisma from "../db"

export const likeVideoService = async (userId: string, videoId: string) => {
    const [like] = await prisma.$transaction([
        prisma.like.create({
            data: { userId, videoId }
        }),
        prisma.video.update({
            where: { id: videoId },
            data: { likeCount: { increment: 1 } }
        })
    ])
    return like
}

export const unlikeVideoService = async (userId: string, videoId: string) => {
    const [deleted] = await prisma.$transaction([
        prisma.like.delete({
            where: {
                userId_videoId: { userId, videoId }
            }
        }),
        prisma.video.update({
            where: { id: videoId },
            data: { likeCount: { decrement: 1 } }
        })
    ])
    return deleted
}

export const hasUserLikedVideoService = async (userId: string, videoId: string) => {
    const like = await prisma.like.findUnique({
        where: {
            userId_videoId: { userId, videoId }
        }
    })
    return !!like
}

export const getLikedVideosService = async (userId: string) => {
    const likes = await prisma.like.findMany({
        where: { userId },
        include: {
            video: {
                include: {
                    channel: true
                }
            }
        },
        orderBy: {
            likedAt: "desc"
        }
    })
    return likes.map(like => like.video)
}
