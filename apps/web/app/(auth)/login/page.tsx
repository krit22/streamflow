"use client"

import { SigninCard } from "@/components/auth/signin-card"
import { useAuth } from "@/hooks/auth/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LoginPage() {
    const { isLoggedIn } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (isLoggedIn) {
            router.push("/feed")
        }
    }, [isLoggedIn, router])

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <SigninCard />
        </div>
    )
}