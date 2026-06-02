import { apiRequest } from "@/lib/api/client";
import type { VideosPage } from "@/lib/api/types";

export type FetchVideosPageParams = {
  limit?: number;
  cursor?: string;
};

export async function fetchVideosPage({
  limit = 12,
  cursor,
}: FetchVideosPageParams = {}): Promise<VideosPage> {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  if (cursor) {
    params.set("cursor", cursor);
  }

  return apiRequest<VideosPage>(`/videos?${params.toString()}`);
}

export async function recordVideoView(videoId: string): Promise<void> {
  await apiRequest<{ message: string }>(`/videos/${videoId}/view`, {
    method: "POST",
  });
}
