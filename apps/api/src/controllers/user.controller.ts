import type { Request, Response } from "express";
import { createUserService, getUserByEmailService } from "../services/user.service";
import { LoginUserSchema, RegisterUserSchema } from "@streamflow/validation"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import dotenv from "dotenv"

// dotenv.config()

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
                "error":{
                    "code": "VALIDATION_ERROR",
                    "message": result.error.message,
                    "issues": result.error.issues
                }
            })
        }
       
        const newUser = await createUserService({ email, password, name });

        res.json({
            "success": true,
            "data":{
                "user":{
                    "id": newUser.id,
                    "email": newUser.email,
                    "name": newUser.name
                }
            }
        })


    } catch (error: any) {
        res.status(409).json({
            "success": false,
            "error":{
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
                "error":{
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
                "error":{
                    "code": "USER NOT FOUND",
                    "message": "Invalid email or password"
                }
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                "success": false,
                "error":{
                    "code": "INVALID_PASSWORD",
                    "message": "Invalid email or password"
                }
            })
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
        res.json({
            "success": true,
            "data":{
                "token": token
            }
        })

    } catch (error: any) {  
        res.status(401).json({
            "success": false,
            "error":{
                "code": "INVALID_CREDENTIALS",
                "message": "Invalid email or password"
            }
        })
    }
}