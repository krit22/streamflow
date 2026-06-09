"use client";

import { apiClient } from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import type { GetChannelProfileResponse } from "@/types/video";

export const channelKeys = {
  all: ["channels"] as const,
  profile: (channelId: string) => [...channelKeys.all, "profile", channelId] as const,
};

async function fetchChannelProfile(channelId: string) {
  const response = await apiClient.get<GetChannelProfileResponse>(
    `/channels/getChannelProfile/${channelId}`
  );
  return response.data.data;
}

export function useChannelProfile(channelId: string) {
  return useQuery({
    queryKey: channelKeys.profile(channelId),
    queryFn: () => fetchChannelProfile(channelId),
    enabled: !!channelId,
  });
}
