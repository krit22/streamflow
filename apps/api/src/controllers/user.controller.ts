import type { Request, Response } from "express";
import { createUserService, getUserByEmailService, getUserByIdService } from "../services/user.service";
import { getUserSubscriptionsService } from "../services/subscription.services";
import { LoginUserSchema, RegisterUserSchema } from "@streamflow/validation";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
    AUTH_COOKIE_NAME,
    getAuthCookieOptions,
    getClearAuthCookieOptions,
} from "../lib/authCookie";

export const registerUserController = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;

        const result = RegisterUserSchema.safeParse({
            email,
            password,
            name
        })

        if (!result.success) {
            return res.status(400).json({
                "success": false,
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": result.error.message,
                    "issues": result.error.issues
                }
            })
        }

        const newUser = await createUserService({ email, password, name });

        res.json({
            "success": true,
            "data": {
                "user": {
                    "id": newUser.id,
                    "email": newUser.email,
                    "name": newUser.name
                }
            }
        })


    } catch (error: any) {
        res.status(409).json({
            "success": false,
            "error": {
                "code": "EMAIL_ALREADY_EXISTS",
                "message": "User with this email already exists"
            }
        })
        console.error(error);
    }
};

export const loginUserController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const result = LoginUserSchema.safeParse({
            email,
            password
        })

        if (!result.success) {
            return res.status(400).json({
                "success": false,
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": result.error.message,
                    "issues": result.error.issues
                }
            })
        }

        const user = await getUserByEmailService(email);

        if (!user) {
            return res.status(401).json({
                "success": false,
                "error": {
                    "code": "USER NOT FOUND",
                    "message": "Invalid email or password"
                }
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                "success": false,
                "error": {
                    "code": "INVALID_PASSWORD",
                    "message": "Invalid email or password"
                }
            })
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

        const cookieOptions = getAuthCookieOptions();
        console.log(`[Login] Setting cookie: ${AUTH_COOKIE_NAME}, Options:`, JSON.stringify(cookieOptions));
        res.cookie(AUTH_COOKIE_NAME, token, cookieOptions);

        return res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                },
            },
        });

    } catch (error: any) {
        res.status(401).json({
            "success": false,
            "error": {
                "code": "INVALID_CREDENTIALS",
                "message": "Invalid email or password"
            }
        })
    }
}

export const logoutUserController = (_req: Request, res: Response) => {
    res.clearCookie(AUTH_COOKIE_NAME, getClearAuthCookieOptions());
    return res.json({ success: true });
};

export const getMeController = async (req: Request, res: Response) => {
    try {
        console.log(`[getMe] Request userId: ${req.userId}`);
        const user = await getUserByIdService(req.userId as string)

        if (!user) {
            console.log(`[getMe] User not found for id: ${req.userId}`);
            return res.status(404).json({
                success: false,
                error: { code: "NOT_FOUND", message: "User not found" }
            })
        }

        console.log(`[getMe] User found: ${user.email}`);
        return res.json({
            success: true,
            data: user
        })
    } catch (e) {
        console.error(e)
        return res.status(500).json({
            success: false,
            error: { code: "INTERNAL_ERROR", message: (e as Error).message }
        })
    }
}

export const getMySubscriptionsController = async (req: Request, res: Response) => {
    try {
        const subscriptions = await getUserSubscriptionsService(req.userId as string)

        return res.json({
            success: true,
            data: subscriptions.map((sub: any) => sub.channel)
        })
    } catch (e) {
        console.error(e)
        return res.status(500).json({
            success: false,
            error: { code: "INTERNAL_ERROR", message: (e as Error).message }
        })
    }
}