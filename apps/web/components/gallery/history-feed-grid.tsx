"use client";

import { HistorySignInPrompt } from "@/components/gallery/history-sign-in-prompt";
import { VideoListGrid } from "@/components/gallery/video-list-grid";
import { useHistoryInfiniteQuery } from "@/hooks/history";
import { selectAuthUser, useAuthStore } from "@/stores/auth-store";

export function HistoryFeedGrid() {
  const user = useAuthStore(selectAuthUser);
  const query = useHistoryInfiniteQuery();

  if (!user) {
    return <HistorySignInPrompt />;
  }

  return (
    <VideoListGrid
      query={query}
      emptyTitle="No watch history yet"
      emptyDescription="Open videos from the home feed while signed in to build your history."
    />
  );
}
