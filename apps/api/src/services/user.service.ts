import prisma from "../db";
import bcrypt from "bcrypt";

export const createUserService = async (userData: any) => {
    const existingUser = await prisma.user.findUnique({
        where: {
            email: userData.email
        }
    })
    if (existingUser) {
        throw new Error("User already exists")
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10)

    const newUser = await prisma.user.create({
        data: {
            email: userData.email,
            password: hashedPassword,
            name: userData.name
        }
    })
    return newUser
};

export const getUserByEmailService = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })
    return user
};

