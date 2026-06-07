import prisma from "../db";

export const recordViewHistoryService = async (userId: string, videoId: string) => {
    return prisma.viewHistory.upsert({
        where: {
            userId_videoId: { userId, videoId },
        },
        create: { userId, videoId },
        update: { viewedAt: new Date() },
    });
};

export const getUserViewHistoryService = async (
    userId: string,
    limit: number,
    cursor?: string,
) => {
    const entries = await prisma.viewHistory.findMany({
        take: limit + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        where: {
            userId,
            video: { status: "UPLOADED" },
        },
        include: {
            video: {
                include: { channel: true },
            },
        },
        orderBy: { viewedAt: "desc" },
    });

    const hasMore = entries.length > limit;
    const page = hasMore ? entries.slice(0, limit) : entries;
    const nextCursor = hasMore ? page[page.length - 1]!.id : null;

    return {
        videos: page.map((entry: any) => entry.video),
        nextCursor,
    };
};
