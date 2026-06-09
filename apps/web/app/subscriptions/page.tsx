"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/auth/useAuth"
import { useSubscriptions } from "@/hooks/channel/useSubscriptions"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2 } from "lucide-react"
import { AppSidebar } from "@/components/ui/sidebar"
import VideosTopbar from "@/components/ui/videosTopbar"

export default function SubscriptionsPage() {
  const { isLoggedIn } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { data: channels, isLoading, error } = useSubscriptions()

  const renderContent = () => {
    if (!isLoggedIn) {
      return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-128px)] gap-4">
          <h2 className="text-2xl font-semibold">You are not logged in yet</h2>
          <p className="text-muted-foreground">Log in to see your subscriptions</p>
          <Button onClick={() => router.push("/login")}>Login</Button>
        </div>
      )
    }

    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-[calc(100vh-128px)]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-128px)] gap-4">
          <h2 className="text-2xl font-semibold">Something went wrong</h2>
          <p className="text-muted-foreground">Failed to load subscriptions</p>
          <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
        </div>
      )
    }

    if (!channels || channels.length === 0) {
      return (
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-8">Subscriptions</h1>
          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 gap-4">
            <p className="text-xl font-medium">You currently have no subscribers</p>
            <p className="text-muted-foreground">Continue watching to subscribe to channels</p>
            <Button onClick={() => router.push("/feed")}>Go to Feed</Button>
          </div>
        </div>
      )
    }

    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Subscriptions</h1>
        <div className="grid gap-4">
          {channels.map((channel) => (
            <Card 
              key={channel.id} 
              className="hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => router.push(`/channel/${channel.id}`)}
            >
              <div className="flex items-center p-4 gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={channel.bannerUrl || ""} />
                  <AvatarFallback>{channel.name[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{channel.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {channel.subscriberCount} subscribers
                  </p>
                </div>
                <Button variant="ghost" onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/channel/${channel.id}`);
                }}>
                  View Channel
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <VideosTopbar
        menuOpen={sidebarOpen}
        onMenuClick={() => setSidebarOpen((open) => !open)}
      />
      <div className="flex">
        <AppSidebar open={sidebarOpen} />
        <main className="flex-1">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

