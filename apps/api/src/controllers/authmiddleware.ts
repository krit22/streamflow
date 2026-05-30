import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

// Extend the Express Request interface to include userId
declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const token = req.headers.authorization?.split(" ")[1]

    try {
        // verify token
        const decodedToken = jwt.verify(token as string, process.env.JWT_SECRET as string) as any;

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