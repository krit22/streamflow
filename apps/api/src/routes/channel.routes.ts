import { Router } from "express"
import { createChannelController, getChannelProfileController } from "../controllers/channel.controller"
import { authMiddleware } from "../controllers/authmiddleware"
import { getSubscriptionStatusController, subscribeController, unsubscribeController } from "../controllers/subscription.controllers"

const router = Router()

router.post("/createchannel", authMiddleware, createChannelController)
router.get("/getChannelProfile/:id", getChannelProfileController)
router.get("/:channelId/subscribe", authMiddleware, getSubscriptionStatusController)
router.post("/:channelId/subscribe", authMiddleware, subscribeController)
router.delete("/:channelId/subscribe", authMiddleware, unsubscribeController)

export default router