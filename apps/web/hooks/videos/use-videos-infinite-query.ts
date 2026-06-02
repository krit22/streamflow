"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { fetchVideosPage } from "@/lib/api/videos";
import { queryKeys } from "@/lib/query/keys";

const FEED_PAGE_SIZE = 12;

export function useVideosInfiniteQuery() {
  return useInfiniteQuery({
    queryKey: queryKeys.videos.list(FEED_PAGE_SIZE),
    queryFn: ({ pageParam }) =>
      fetchVideosPage({
        limit: FEED_PAGE_SIZE,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export { FEED_PAGE_SIZE };
