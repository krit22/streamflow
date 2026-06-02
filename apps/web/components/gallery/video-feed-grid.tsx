"use client";

import { VideoListGrid } from "@/components/gallery/video-list-grid";
import { useVideosInfiniteQuery } from "@/hooks/videos";

export function VideoFeedGrid() {
  const query = useVideosInfiniteQuery();

  return (
    <VideoListGrid
      query={query}
      emptyTitle="No videos yet"
      emptyDescription="Check back soon for curated originals."
    />
  );
}
