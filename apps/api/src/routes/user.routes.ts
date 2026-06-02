import { Router } from "express";
import { authMiddleware } from "../controllers/authmiddleware";
import {
    getMeController,
    getMySubscriptionsController,
    loginUserController,
    logoutUserController,
    registerUserController,
} from "../controllers/user.controller";
import { getMyViewHistoryController } from "../controllers/viewHistory.controller";

const router = Router();

router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.post("/logout", logoutUserController);
router.get("/me/subscriptions", authMiddleware, getMySubscriptionsController);
router.get("/me/history", authMiddleware, getMyViewHistoryController);
router.get("/me", authMiddleware, getMeController);

export default router;