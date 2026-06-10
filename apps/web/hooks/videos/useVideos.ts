"use client"

import { apiClient } from "@/lib/apiClient"
import type { GetVideosResponse } from "@/types/video"
import { useInfiniteQuery } from "@tanstack/react-query"

const DEFAULT_LIMIT = 12

export const videoKeys = {
  all: ["videos"] as const,
  feed: (limit: number) => [...videoKeys.all, "feed", limit] as const,
  history: (limit: number) => [...videoKeys.all, "history", limit] as const,
  detail: (videoId: string) => [...videoKeys.all, "detail", videoId] as const,
}

async function fetchVideosPage(limit: number, cursor?: string) {
  const response = await apiClient.get<GetVideosResponse>("/videos", {
    params: {
      limit,
      ...(cursor ? { cursor } : {}),
    },
  })

  return response.data.data
}

async function fetchHistoryPage(limit: number, cursor?: string) {
  const response = await apiClient.get<GetVideosResponse>("/users/me/history", {
    params: {
      limit,
      ...(cursor ? { cursor } : {}),
    },
  })

  return response.data.data
}

export function useVideos(limit = DEFAULT_LIMIT) {
  return useInfiniteQuery({
    queryKey: videoKeys.feed(limit),
    queryFn: ({ pageParam }) => fetchVideosPage(limit, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  })
}

export function useHistory(limit = DEFAULT_LIMIT) {
  return useInfiniteQuery({
    queryKey: videoKeys.history(limit),
    queryFn: ({ pageParam }) => fetchHistoryPage(limit, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  })
}
