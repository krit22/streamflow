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