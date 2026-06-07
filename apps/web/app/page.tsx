"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SignupCard } from "@/components/auth/signup-card"

import { useTheme } from "next-themes"
import { SunIcon } from "lucide-react"

export default function Home() {
  const { theme, setTheme } = useTheme()
  return (
    <>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold">Streamflow</span>
          <Button size="lg" variant="link">Login</Button>
          <Button size="lg" variant="link">Signup</Button>
          <Button size="lg" variant="link">Videos</Button>
        </div>
        <div>
          <Button variant="outline" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <SunIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center h-screen">
        <SignupCard />
      </div>

    </>
  );
}
