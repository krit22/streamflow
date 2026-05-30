import { createChannelSchema } from "@streamflow/validation"
import type { Request, Response } from "express"
import { createChannelService, getChannelService } from "../services/channel.services"

//creates a new channel
export const createChannelController = async (req: Request, res: Response) => {

    const { name, description } = req.body

    const result = createChannelSchema.safeParse({
        name,
        description
    })

    if (!result.success) {
        return res.status(400).json({
            success: false,
            error: {
                code: "VALIDATION_ERROR",
                message: result.error.message,
                issues: result.error.issues
            }
        })
    }

    //2. create the channel using service
    const channel = await createChannelService(name, description, req.userId as string)


    //3. return the channel detials to the user
    return res.status(201).json({
        success: true,
        data: {
            "id": channel.id,
            "name": channel.name,
            "description": channel.description,
            "userId": req.userId
        }
    })
}

export const getChannelProfileController = async (req: Request, res: Response) => {

    try {
        const channelId = req.params.id as string

        const channelDetails = await getChannelService(channelId)

        //return the channel detials

        return res.status(200).json({
            success: true,
            data: {
                "id": channelDetails.id,
                "name": channelDetails.name,
                "description": channelDetails.description,
                "subscriberCount": channelDetails.subscriberCount,
                "videos": channelDetails.videos
            }
        })

    } catch (e) {
        return res.status(500).json({
            success: false,
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "Internal server error",
                issues: [e as string]
            }
        })
    }
}
