"use client";

// Hook to fetch and manage single video details
import { apiClient } from "@/lib/apiClient"
import type { GetVideoResponse } from "@/types/video"
import { useQuery } from "@tanstack/react-query"
import { videoKeys } from "./useVideos"

async function fetchVideoDetails(videoId: string) {
  const response = await apiClient.get<GetVideoResponse>(`/videos/${videoId}`)
  return response.data.data
}

export const useVideoDetails = (videoId: string) => {
  return useQuery({
    queryKey: videoKeys.detail(videoId),
    queryFn: () => fetchVideoDetails(videoId),
    enabled: !!videoId,
  })
}
