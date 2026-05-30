import { Router } from "express"
import { createChannelController, getChannelProfileController } from "../controllers/channel.controller"
import { authMiddleware } from "../controllers/authmiddleware"

const router = Router()

router.post("/createchannel", authMiddleware, createChannelController)
router.get("/getChannelProfile/:id", getChannelProfileController)

export default router           