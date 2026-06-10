"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useAuth } from "@/hooks/auth/useAuth";
import type { Video } from "@/types/video";

export function useLikedVideos() {
  const { isLoggedIn } = useAuth();

  return useQuery({
    queryKey: ["likedVideos"],
    queryFn: async () => {
      const response = await apiClient.get("/users/me/likes");
      return response.data.data as (Video & { channel: { name: string } })[];
    },
    enabled: isLoggedIn,
  });
}
