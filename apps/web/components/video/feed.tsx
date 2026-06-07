"use client";

import { useVideos } from "@/hooks/videos/useVideos";
import { VideoCard } from "@/components/ui/videocard";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const SidebarFeed = () => {
  const { data, isLoading, error } = useVideos(20);

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) return null;

  const videos = data?.pages.flatMap((page) => page.videos) || [];

  return (
    <div className="space-y-4">
      {videos.map((video) => (
        <Link key={video.id} href={`/video/${video.id}`} className="block group">
          <div className="flex gap-3">
            <div className="relative aspect-video w-40 shrink-0 overflow-hidden rounded-lg bg-muted">
              <Image
                src={video.thumbnailUrl || ""}
                alt={video.title}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <h3 className="text-sm font-semibold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                {video.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {video.channel.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {video.viewsCount.toLocaleString()} views • {new Date(video.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
