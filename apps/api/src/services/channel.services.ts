import prisma from "../db"

export const createChannelService = async (name: string, description: string, userId: string) => {

    const channel = await prisma.channel.create({
        data: {
            name,
            description,
            userId
        }
    })

    return channel

}

export const getChannelService = async (channelId: string) => {

    try {
        const channel = await prisma.channel.findUnique({
            where: {
                id: channelId
            },
            include: {
                videos: true
            }
        })

        if (!channel) {
            throw new Error("Channel not found")
        }

        return channel

    } catch (error) {
        console.log(error)
        throw error
    }

}
