"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/auth/useAuth"

export function AlreadyLoggedInCard() {
    const router = useRouter()
    const { user } = useAuth()

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Already logged in</CardTitle>
                <CardDescription>
                    You are already signed in as {user?.name}.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-1 p-3 border rounded-lg bg-muted/50">
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</span>
                        <span className="text-sm font-medium">{user?.name}</span>
                    </div>
                    <div className="flex flex-col mt-2">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</span>
                        <span className="text-sm font-medium">{user?.email}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={() => router.push("/feed")} className="w-full">
                    Go to Videos
                </Button>
            </CardFooter>
        </Card>
    )
}
