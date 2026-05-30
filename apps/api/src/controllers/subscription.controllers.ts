import type { Request, Response } from "express"
import { getChannelService } from "../services/channel.services"
import { subscribeService, unsubscribeService, isSubscribedService } from "../services/subscription.services"

export const subscribeController = async (req: Request, res: Response) => {
    const channelId = req.params.channelId as string
    const userId = req.userId as string

    try {
        const channel = await getChannelService(channelId)
        if (!channel) {
            return res.status(404).json({
                success: false,
                error: { code: "NOT_FOUND", message: "Channel not found" }
            })
        }

        // Prevent self-subscription
        if (channel.userId === userId) {
            return res.status(400).json({
                success: false,
                error: { code: "BAD_REQUEST", message: "You cannot subscribe to your own channel" }
            })
        }

        const alreadySubscribed = await isSubscribedService(userId, channelId)
        if (alreadySubscribed) {
            return res.status(409).json({
                success: false,
                error: { code: "ALREADY_SUBSCRIBED", message: "You are already subscribed to this channel" }
            })
        }

        await subscribeService(userId, channelId)

        return res.status(201).json({
            success: true,
            message: "Subscribed successfully"
        })
    } catch (e) {
        console.error(e)
        return res.status(500).json({
            success: false,
            error: { code: "INTERNAL_ERROR", message: (e as Error).message }
        })
    }
}

export const unsubscribeController = async (req: Request, res: Response) => {
    const channelId = req.params.channelId as string
    const userId = req.userId as string

    try {
        const channel = await getChannelService(channelId)
        if (!channel) {
            return res.status(404).json({
                success: false,
                error: { code: "NOT_FOUND", message: "Channel not found" }
            })
        }

        const isSubscribed = await isSubscribedService(userId, channelId)
        if (!isSubscribed) {
            return res.status(409).json({
                success: false,
                error: { code: "NOT_SUBSCRIBED", message: "You are not subscribed to this channel" }
            })
        }

        await unsubscribeService(userId, channelId)

        return res.json({
            success: true,
            message: "Unsubscribed successfully"
        })
    } catch (e) {
        console.error(e)
        return res.status(500).json({
            success: false,
            error: { code: "INTERNAL_ERROR", message: (e as Error).message }
        })
    }
}

export const getSubscriptionStatusController = async (req: Request, res: Response) => {
    const channelId = req.params.channelId as string
    const userId = req.userId as string

    try {
        const channel = await getChannelService(channelId)
        if (!channel) {
            return res.status(404).json({
                success: false,
                error: { code: "NOT_FOUND", message: "Channel not found" }
            })
        }

        const isSubscribed = await isSubscribedService(userId, channelId)

        return res.json({
            success: true,
            data: { isSubscribed }
        })
    } catch (e) {
        console.error(e)
        return res.status(500).json({
            success: false,
            error: { code: "INTERNAL_ERROR", message: (e as Error).message }
        })
    }
}
