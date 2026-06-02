"use client";

import type { UseInfiniteQueryResult, InfiniteData } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { VideoCard } from "@/components/gallery/video-card";
import { VideoFeedSkeleton } from "@/components/gallery/video-feed-skeleton";
import { AlertBanner } from "@/components/ui/alert-banner";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api/errors";
import type { FeedVideo, VideosPage } from "@/lib/api/types";

type VideoListGridProps = {
  query: UseInfiniteQueryResult<InfiniteData<VideosPage>, Error>;
  emptyTitle: string;
  emptyDescription: string;
};

export function VideoListGrid({
  query,
  emptyTitle,
  emptyDescription,
}: VideoListGridProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { data, error, isPending, isError, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } =
    query;

  const videos: FeedVideo[] = data?.pages.flatMap((page) => page.videos) ?? [];

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage || isFetchingNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isPending) {
    return <VideoFeedSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <AlertBanner message={getApiErrorMessage(error, "Failed to load videos.")} />
        <Button type="button" onClick={() => void refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
          {emptyTitle}
        </p>
        <p className="mt-2 font-body-md text-body-md text-secondary">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-x-gutter gap-y-16 md:grid-cols-2 xl:grid-cols-3">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
      <div ref={sentinelRef} className="h-4 w-full" aria-hidden />
      {isFetchingNextPage ? (
        <p className="mt-8 text-center font-body-md text-body-md text-secondary">
          Loading more…
        </p>
      ) : null}
      {!hasNextPage && videos.length > 0 ? (
        <p className="mt-8 text-center font-body-md text-body-md text-secondary opacity-80">
          You&apos;ve reached the end.
        </p>
      ) : null}
    </>
  );
}
