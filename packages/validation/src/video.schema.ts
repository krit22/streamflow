import { z } from "zod"

export const initalizeVideoUploadSchema = z.object({
    channelId: z.string().uuid(),
    title: z.string().min(3, "Title cannot be empty").max(100, "Title exceeds 100 characters"),
    description: z.string().min(3, "Description cannot be empty").max(1000, "Description exceeds 1000 characters").optional(),
    contentType: z.literal("video/mp4"),
    thumbnailContentType: z.literal("image/png"),
})

export type InitalizeVideoUploadInput = z.infer<typeof initalizeVideoUploadSchema>

export const videoUploadFormSchema = z.object({
    channelId: z.string().uuid(),
    title: z.string().min(3, "Title cannot be empty").max(100, "Title exceeds 100 characters"),
    description: z
        .string()
        .max(1000, "Description exceeds 1000 characters")
        .optional()
        .refine(
            (value) =>
                !value || value.trim().length === 0 || value.trim().length >= 3,
            {
                message: "Description must be at least 3 characters if provided",
            },
        ),
    thumbnail: z.any().refine((file) => file instanceof File, "Thumbnail is required")
})

export type VideoUploadFormInput = z.infer<typeof videoUploadFormSchema>

export const updateVideoSchema = z.object({
    title: z.string().min(3, "Title cannot be empty").max(100, "Title exceeds 100 characters").optional(),
    description: z.string().min(3, "Description cannot be empty").max(1000, "Description exceeds 1000 characters").optional(),
    type: z.enum(["PUBLIC", "PRIVATE", "LINK_ONLY"]).optional(),
    thumbnailUrl: z.string().url("Invalid thumbnail URL").optional(),
})

export type UpdateVideoInput = z.infer<typeof updateVideoSchema>
