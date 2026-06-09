"use client";

import { useEffect } from "react";
import { apiClient } from "@/lib/apiClient";

export function useViewTracker(videoId: string) {
  useEffect(() => {
    if (!videoId) return;

    const trackView = async () => {
      try {
        await apiClient.post(`/videos/${videoId}/view`);
      } catch (error) {
        console.error("Failed to track view:", error);
      }
    };

    trackView();
  }, [videoId]);
}
