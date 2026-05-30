import prisma from "../db"

export const subscribeService = async (userId: string, channelId: string) => {
    // Create subscription and increment subscriber count atomically
    const [subscription] = await prisma.$transaction([
        prisma.subscription.create({
            data: { userId, channelId }
        }),
        prisma.channel.update({
            where: { id: channelId },
            data: { subscriberCount: { increment: 1 } }
        })
    ])
    return subscription
}

export const unsubscribeService = async (userId: string, channelId: string) => {
    const [deleted] = await prisma.$transaction([
        prisma.subscription.delete({
            where: {
                userId_channelId: { userId, channelId }
            }
        }),
        prisma.channel.update({
            where: { id: channelId },
            data: { subscriberCount: { decrement: 1 } }
        })
    ])
    return deleted
}

export const isSubscribedService = async (userId: string, channelId: string) => {
    const sub = await prisma.subscription.findUnique({
        where: {
            userId_channelId: { userId, channelId }
        }
    })
    return !!sub
}

export const getUserSubscriptionsService = async (userId: string) => {
    return prisma.subscription.findMany({
        where: { userId },
        include: {
            channel: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    bannerUrl: true,
                    subscriberCount: true,
                    createdAt: true,
                    userId: true,
                }
            }
        },
        orderBy: { id: "desc" }
    })
}
