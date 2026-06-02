import { apiRequest } from "@/lib/api/client";
import type { VideosPage } from "@/lib/api/types";

export type FetchHistoryPageParams = {
  limit?: number;
  cursor?: string;
};

export async function fetchHistoryPage({
  limit = 12,
  cursor,
}: FetchHistoryPageParams = {}): Promise<VideosPage> {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  if (cursor) {
    params.set("cursor", cursor);
  }

  return apiRequest<VideosPage>(`/users/me/history?${params.toString()}`);
}
