"use client";

import { useState } from "react";
import Link from "next/link";
import { AppSidebar } from "@/components/ui/sidebar";
import { VideoCard } from "@/components/ui/videocard";
import VideosTopbar from "@/components/ui/videosTopbar";
import { useLikedVideos } from "@/hooks/videos/useLikedVideos";
import { useAuth } from "@/hooks/auth/useAuth";
import { getApiErrorMessage } from "@/lib/apiClient";
import { mapVideoToCardProps } from "@/lib/video";
import { Button } from "@/components/ui/button";

export default function LikedVideosPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isLoggedIn } = useAuth();
  const { data: videos, isLoading, isError, error } = useLikedVideos();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <VideosTopbar
        menuOpen={sidebarOpen}
        onMenuClick={() => setSidebarOpen((open) => !open)}
      />
      <div className="flex">
        <AppSidebar open={sidebarOpen} />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">Liked videos</h1>

          {!isLoggedIn ? (
            <div className="flex flex-col items-center justify-center mt-20 text-center">
              <p className="text-lg text-muted-foreground mb-4">
                You are currently not logged in. You will have to first log in to be able to have liked videos.
              </p>
              <Button asChild>
                <Link href="/login">Log in</Link>
              </Button>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-video w-full rounded-xl bg-muted animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                    <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <p className="text-sm text-destructive">
              {getApiErrorMessage(error, "Failed to load liked videos.")}
            </p>
          ) : videos && videos.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-20 text-center">
              <p className="text-lg text-muted-foreground mb-4">
                You do not have any liked videos. Continue watching to like a video
              </p>
              <Button asChild>
                <Link href="/feed">Explore videos</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {videos?.map((video) => (
                <VideoCard key={video.id} {...mapVideoToCardProps(video)} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
