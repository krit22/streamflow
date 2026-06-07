"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/ui/sidebar"
import VideosTopbar from "@/components/ui/videosTopbar"

export default function FeedPage() {
    const [sidebarOpen, setSidebarOpen] = useState(true)

    return (
        <div className="min-h-screen bg-background">
            <VideosTopbar
                menuOpen={sidebarOpen}
                onMenuClick={() => setSidebarOpen((open) => !open)}
            />
            <div className="flex">
                <AppSidebar open={sidebarOpen} />
                <main className="flex-1 p-4">
                    {/* video grid coming soon */}
                </main>
            </div>
        </div>
    )
}
