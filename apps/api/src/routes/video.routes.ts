import { Router } from "express";
import { authMiddleware } from "../controllers/authmiddleware";
import { initalizeVideoUploadController } from "../controllers/video.controllers";

const router = Router();

router.post("/initialize", authMiddleware, initalizeVideoUploadController) //initalize video upload using signed URL

export default router