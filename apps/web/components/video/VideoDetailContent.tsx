"use client";

import { SidebarFeed } from "@/components/video/feed";
import { CustomVideoPlayer } from "@/components/video/customVideoPlayer";
import { useVideoDetails } from "@/hooks/videos/useVideoDetails";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, Share2, ThumbsUp, MoreVertical } from "lucide-react";

interface VideoDetailContentProps {
  videoID: string;
}

export function VideoDetailContent({ videoID }: VideoDetailContentProps) {
  const { data: video, isLoading } = useVideoDetails(videoID);

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (!video) return <div className="p-8 text-destructive">Video not found</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-6 max-w-[1800px] mx-auto">
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <CustomVideoPlayer videoId={videoID} />

        <div className="mt-4 space-y-4">
          <h1 className="text-xl font-bold line-clamp-2">{video.title}</h1>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={video.channel.bannerUrl || ""} />
                <AvatarFallback>{video.channel.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-sm">{video.channel.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {video.channel.subscriberCount.toLocaleString()} subscribers
                </p>
              </div>
              <Button variant="default" className="rounded-full px-6 ml-2">
                Subscribe
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-muted rounded-full">
                <Button variant="ghost" className="rounded-l-full gap-2 px-4 hover:bg-muted-foreground/10">
                  <ThumbsUp className="h-4 w-4" />
                  <span className="text-sm font-medium">{video.likeCount}</span>
                </Button>
                <div className="w-[1px] h-6 bg-border" />
                <Button variant="ghost" className="rounded-r-full px-4 hover:bg-muted-foreground/10">
                  <ThumbsUp className="h-4 w-4 rotate-180" />
                </Button>
              </div>
              <Button variant="secondary" className="rounded-full gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button variant="secondary" size="icon" className="rounded-full">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="bg-muted/50 rounded-xl p-3 text-sm">
            <div className="flex gap-2 font-bold mb-1">
              <span>{video.viewsCount.toLocaleString()} views</span>
              <span>{new Date(video.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="whitespace-pre-wrap leading-relaxed">
              {video.description || "No description provided."}
            </p>
          </div>

          {/* Comments Section Placeholder */}
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Comments
            </h3>
            <div className="text-muted-foreground italic text-sm">
              Comments feature coming soon...
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Feed */}
      <div className="w-full lg:w-[400px] shrink-0">
        <div className="sticky top-6">
          <h2 className="text-lg font-bold mb-4">Up Next</h2>
          <SidebarFeed />
        </div>
      </div>
    </div>
  );
}
