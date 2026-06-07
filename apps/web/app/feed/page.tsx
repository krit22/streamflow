"use client"

import { useState, useEffect, useRef } from "react"
import { AppSidebar } from "@/components/ui/sidebar"
import { VideoCard } from "@/components/ui/videocard"
import VideosTopbar from "@/components/ui/videosTopbar"
import { useVideos } from "@/hooks/videos/useVideos"
import { getApiErrorMessage } from "@/lib/apiClient"
import { mapVideoToCardProps } from "@/lib/video"

export default function FeedPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const observerRef = useRef<HTMLDivElement>(null)

  const {
    data,
    error,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useVideos()

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
        <main className="flex-1 p-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading videos...</p>
          ) : null}

          {isError ? (
            <p className="text-sm text-destructive">
              {getApiErrorMessage(error, "Failed to load videos.")}
            </p>
          ) : null}

          {!isLoading && !isError && videos.length === 0 ? (
            <p className="text-sm text-muted-foreground">No videos yet.</p>
          ) : null}

          {videos.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {videos.map((video) => (
                  <VideoCard key={video.id} {...mapVideoToCardProps(video)} />
                ))}
              </div>

              {/* Sentinel element for infinite scroll */}
              <div ref={observerRef} className="h-10 mt-4 flex justify-center items-center">
                {isFetchingNextPage && (
                  <p className="text-sm text-muted-foreground">Loading more videos...</p>
                )}
              </div>
            </>
          ) : null}
        </main>
      </div>
    </div>
  )
}
