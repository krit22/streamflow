import { z } from "zod"

export const createChannelSchema = z.object({
    name: z.string(),
    description: z.string()
})

export type createChannelInput = z.infer<typeof createChannelSchema>
