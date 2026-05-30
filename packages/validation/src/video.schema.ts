import { z } from "zod"

export const initalizeVideoUploadSchema = z.object({
    channelId: z.string().uuid(),
    title: z.string().min(3, "Title cannot be empty").max(100, "Title exceeds 100 characters"),
    description: z.string().min(3, "Description cannot be empty").max(1000, "Description exceeds 1000 characters").optional(),
    contentType: z.literal("video/mp4"),
})

export type InitalizeVideoUploadInput = z.infer<typeof initalizeVideoUploadSchema>
