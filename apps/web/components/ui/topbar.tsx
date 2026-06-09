"use client"

import { Button } from "@/components/ui/button"
import { Moon, Sun, User, Upload } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from 'next/navigation'
import { useAuthStore } from "@/store/auth/store"
import { useLogout } from "@/hooks/auth/useLogout"
import { useUIStore } from "@/store/useUIStore"

export default function Topbar() {
    const router = useRouter()
    const { theme, setTheme } = useTheme()
    const { user, isLoggedIn } = useAuthStore()
    const openUploadModal = useUIStore((state) => state.openUploadModal)
    const logout = useLogout()

    return (
        <div className="border-b-2 flex items-center justify-between">
            <div className="flex items-center gap-4 px-4 py-2">
                <span className="font-bold text-xl cursor-pointer" onClick={() => router.push("/")}>Streamflow</span>

                {isLoggedIn ? (
                    <>
                        <div className="flex items-center gap-2 px-2">
                            <User size={18} />
                            <span className="text-sm font-medium">{user?.name}</span>
                        </div>
                        <Button 
                            onClick={openUploadModal} 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center gap-2"
                        >
                            <Upload size={18} />
                            <span>Upload</span>
                        </Button>
                        <Button onClick={() => logout.mutate()} variant="link" disabled={logout.isPending}>
                            {logout.isPending ? "Logging out..." : "Logout"}
                        </Button>
                    </>
                ) : (
                    <>
                        <Button onClick={() => router.push("/login")} variant="link">Sign In</Button>
                        <Button onClick={() => router.push("/register")} variant="link">Sign Up</Button>
                    </>
                )}

                <Button onClick={() => router.push("/feed")} variant="link">Videos</Button>
            </div>
            <div className="px-4">
                <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                    {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
            </div>
        </div>
    )
}
