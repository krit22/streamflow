import { Router } from "express";
import { authMiddleware } from "../controllers/authmiddleware";
import { getMeController, getMySubscriptionsController, loginUserController, registerUserController } from "../controllers/user.controller";

const router = Router();

router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.get("/me/subscriptions", authMiddleware, getMySubscriptionsController);
router.get("/me", authMiddleware, getMeController);

export default router;