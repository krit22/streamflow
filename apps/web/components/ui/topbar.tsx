"use client"

import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { useRouter } from 'next/navigation'

export default function Topbar() {
    const router = useRouter()

    const { theme, setTheme } = useTheme()
    return (
        <div className="border-b-2 flex items-center justify-between">
            <div className="flex items-center gap-4 px-4 py-2">
                <span>Streamflow</span>
                <Button onClick={() => router.push("/login")} variant="link">Sign In</Button>
                <Button onClick={() => router.push("/register")} variant="link">Sign Up</Button>
                <Button onClick={() => router.push("/feed")} variant="link">Videos</Button>
            </div>
            <div>
                <Button variant="ghost" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                    {theme === "dark" ? <Sun /> : <Moon />}
                </Button>
            </div>
        </div>
    )
}