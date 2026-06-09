"use client"

import { Button } from "@/components/ui/button"
import { SignupCard } from "@/components/auth/signup-card"
import { useTheme } from "next-themes"
import { SunIcon } from "lucide-react"
import { useAuth } from "@/hooks/auth/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const { theme, setTheme } = useTheme()
  const { isLoggedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/feed")
    }
  }, [isLoggedIn, router])

  return (
    <>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold">Streamflow</span>
          <Button size="lg" variant="link" onClick={() => router.push("/login")}>
            Login
          </Button>
          <Button size="lg" variant="link" onClick={() => router.push("/register")}>
            Signup
          </Button>
          <Button size="lg" variant="link" onClick={() => router.push("/feed")}>
            Videos
          </Button>
        </div>
        <div>
          <Button
            variant="outline"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <SunIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center h-screen">
        <SignupCard />
      </div>
    </>
  )
}
