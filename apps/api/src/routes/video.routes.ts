import { Router } from "express";
import { authMiddleware } from "../controllers/authmiddleware";
import { finalizeVideoUploadController, initalizeVideoUploadController } from "../controllers/video.controllers";

const router = Router();

router.post("/initialize", authMiddleware, initalizeVideoUploadController) //initalize video upload using signed URL
router.post("/:videoId/finalize", authMiddleware, finalizeVideoUploadController)

export default router