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

export const getUserByIdService = async (userId: string) => {
    return prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            name: true,
            profileUrl: true,
            createdAt: true,
            channels: {
                select: { id: true, name: true, description: true, subscriberCount: true, createdAt: true }
            }
        }
    })
};
