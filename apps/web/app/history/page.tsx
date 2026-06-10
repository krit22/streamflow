"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { AppSidebar } from "@/components/ui/sidebar"
import { VideoCard } from "@/components/ui/videocard"
import VideosTopbar from "@/components/ui/videosTopbar"
import { useHistory } from "@/hooks/videos/useVideos"
import { useAuth } from "@/hooks/auth/useAuth"
import { getApiErrorMessage } from "@/lib/apiClient"
import { mapVideoToCardProps } from "@/lib/video"
import { Button } from "@/components/ui/button"
import { History, LogIn, PlayCircle } from "lucide-react"

export default function HistoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const observerRef = useRef<HTMLDivElement>(null)
  const { isLoggedIn } = useAuth()

  const {
    data,
    error,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useHistory()

  const videos = data?.pages.flatMap((page) => page.videos) ?? []

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.01 }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <div className="min-h-screen bg-background">
      <VideosTopbar
        menuOpen={sidebarOpen}
        onMenuClick={() => setSidebarOpen((open) => !open)}
      />
      <div className="flex">
        <AppSidebar open={sidebarOpen} />
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {!isLoggedIn ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-muted p-6 rounded-full mb-6">
                  <History className="size-12 text-muted-foreground" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Keep track of what you watch</h1>
                <p className="text-muted-foreground mb-8 max-w-sm">
                  Watch history isn't viewable when you're signed out. Login or sign up to view your history.
                </p>
                <Button asChild size="lg">
                  <Link href="/login" className="gap-2">
                    <LogIn className="size-4" />
                    Sign in
                  </Link>
                </Button>
              </div>
            ) : (
              <>
                <h1 className="text-4xl font-bold mb-8">History</h1>

                {isLoading ? (
                  <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="space-y-3">
                        <div className="aspect-video bg-muted animate-pulse rounded-xl" />
                        <div className="flex gap-3">
                          <div className="size-9 bg-muted animate-pulse rounded-full" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                            <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}

                {isError ? (
                  <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
                    {getApiErrorMessage(error, "Failed to load history.")}
                  </div>
                ) : null}

                {!isLoading && !isError && videos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="bg-muted p-6 rounded-full mb-6">
                      <PlayCircle className="size-12 text-muted-foreground" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Your history is empty</h2>
                    <p className="text-muted-foreground mb-8 max-w-sm">
                      You currently do not have a user history. Continue watching videos to add videos to your history.
                    </p>
                    <Button asChild variant="outline">
                      <Link href="/feed">Explore videos</Link>
                    </Button>
                  </div>
                ) : null}

                {videos.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {videos.map((video) => (
                        <VideoCard key={video.id} {...mapVideoToCardProps(video)} />
                      ))}
                    </div>

                    {/* Sentinel element for infinite scroll */}
                    <div ref={observerRef} className="h-10 mt-8 flex justify-center items-center">
                      {isFetchingNextPage && (
                        <p className="text-sm text-muted-foreground animate-pulse">
                          Loading more videos...
                        </p>
                      )}
                    </div>
                  </>
                ) : null}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
