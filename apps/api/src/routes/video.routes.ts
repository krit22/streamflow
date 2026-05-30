import { Router } from "express";
import { authMiddleware } from "../controllers/authmiddleware";
import {
    createCommentController,
    deleteCommentController,
    getCommentsController,
} from "../controllers/comment.controllers";
import { getLikeStatusController, likeVideoController, unlikeVideoController } from "../controllers/like.controllers";
import {
    deleteVideoController,
    finalizeVideoUploadController,
    getVideoController,
    getVideosController,
    incrementViewCountController,
    initalizeVideoUploadController,
    updateVideoController,
} from "../controllers/video.controllers";

const router = Router();

router.post("/initialize", authMiddleware, initalizeVideoUploadController)
router.get("/", getVideosController)
router.post("/:videoId/finalize", authMiddleware, finalizeVideoUploadController)
router.post("/:videoId/view", incrementViewCountController)
router.get("/:videoId/like", authMiddleware, getLikeStatusController)
router.post("/:videoId/like", authMiddleware, likeVideoController)
router.delete("/:videoId/like", authMiddleware, unlikeVideoController)
router.post("/:videoId/comments", authMiddleware, createCommentController)
router.get("/:videoId/comments", getCommentsController)
router.delete("/:videoId/comments/:commentId", authMiddleware, deleteCommentController)
router.patch("/:videoId", authMiddleware, updateVideoController)
router.delete("/:videoId", authMiddleware, deleteVideoController)
router.get("/:videoId", getVideoController)

export default router