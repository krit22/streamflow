import { z } from "zod"

export const createCommentSchema = z.object({
    commentBody: z.string().min(1, "Comment cannot be empty").max(1000, "Comment exceeds 1000 characters"),
})

export type CreateCommentInput = z.infer<typeof createCommentSchema>
