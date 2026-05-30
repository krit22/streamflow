import prisma from "../db"

export const createCommentService = async (videoId: string, userId: string, commentBody: string) => {
    return prisma.comment.create({
        data: { videoId, userId, commentBody },
        include: {
            user: {
                select: { id: true, name: true, profileUrl: true }
            }
        }
    })
}

export const getCommentsByVideoService = async (videoId: string, limit: number, cursor?: string) => {
    return prisma.comment.findMany({
        where: { videoId },
        take: limit,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        orderBy: { createdAt: "desc" },
        include: {
            user: {
                select: { id: true, name: true, profileUrl: true }
            }
        }
    })
}

export const deleteCommentService = async (commentId: string) => {
    return prisma.comment.delete({
        where: { id: commentId }
    })
}

export const getCommentByIdService = async (commentId: string) => {
    return prisma.comment.findUnique({
        where: { id: commentId }
    })
}
