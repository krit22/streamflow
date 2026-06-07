"use client";

import ReactPlayer from "react-player";
import { useVideoDetails } from "@/hooks/videos/useVideoDetails";
import { Loader2 } from "lucide-react";

interface CustomVideoPlayerProps {
  videoId: string;
}

export const CustomVideoPlayer = ({ videoId }: CustomVideoPlayerProps) => {
  const { data: video, isLoading, error } = useVideoDetails(videoId);

  if (isLoading) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-muted/20 border border-border/50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-muted/20 text-destructive border border-border/50">
        {error ? "Failed to load video" : "Video not found"}
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-black aspect-video shadow-2xl border border-white/5">
      <ReactPlayer
        src={video.videoUrl}
        controls
        width="100%"
        height="100%"
        playing
      />
    </div>
  );
};
