import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AUTH_COOKIE_NAME } from "../lib/authCookie";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.[AUTH_COOKIE_NAME];

    if (!token) {
        return res.status(401).json({
            success: false,
            error: {
                code: "UNAUTHORIZED",
                message: "Authentication required",
                issues: ["Valid session cookie is required"],
            },
        });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as {
            userId: string;
        };

        // add the decoded token to the request  
        req.userId = decodedToken.userId;

        // call the next middleware
        next();

    } catch (error) {
        // MUST return here to stop execution if token fails
        return res.status(401).json({
            success: false,
            error: {
                code: "UNAUTHORIZED",
                message: "Token not found or invalid",
                issues: ["Token is required for authentication and must be valid"]
            }
        });
    }
}

/** Sets req.userId when a valid session cookie is present; continues otherwise. */
export const optionalAuthMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const token = req.cookies?.[AUTH_COOKIE_NAME];

    if (!token) {
        return next();
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as {
            userId: string;
        };
        req.userId = decodedToken.userId;
    } catch {
        // Ignore invalid tokens for optional auth routes
    }

    return next();
};