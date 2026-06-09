"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useAuth } from "@/hooks/auth/useAuth";
import { videoKeys } from "./useVideos";
import { Video } from "@/types/video";

export function useLike(videoId: string) {
  const { isLoggedIn } = useAuth();
  const queryClient = useQueryClient();

  const { data: likeStatus, isLoading } = useQuery({
    queryKey: ["likeStatus", videoId],
    queryFn: async () => {
      const response = await apiClient.get(`/videos/${videoId}/like`);
      return response.data.data; // { isLiked: boolean }
    },
    enabled: isLoggedIn && !!videoId,
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post(`/videos/${videoId}/like`);
    },
    onMutate: async () => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["likeStatus", videoId] });
      await queryClient.cancelQueries({ queryKey: videoKeys.detail(videoId) });

      // Snapshot the previous value
      const previousLikeStatus = queryClient.getQueryData(["likeStatus", videoId]);
      const previousVideoDetail = queryClient.getQueryData<Video>(videoKeys.detail(videoId));

      // Optimistically update to the new value
      queryClient.setQueryData(["likeStatus", videoId], { isLiked: true });
      if (previousVideoDetail) {
        queryClient.setQueryData<Video>(videoKeys.detail(videoId), {
          ...previousVideoDetail,
          likeCount: previousVideoDetail.likeCount + 1,
        });
      }

      return { previousLikeStatus, previousVideoDetail };
    },
    onError: (err, variables, context) => {
      // Rollback to the previous value if mutation fails
      if (context) {
        queryClient.setQueryData(["likeStatus", videoId], context.previousLikeStatus);
        queryClient.setQueryData(videoKeys.detail(videoId), context.previousVideoDetail);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we're in sync with the server
      queryClient.invalidateQueries({ queryKey: ["likeStatus", videoId] });
      queryClient.invalidateQueries({ queryKey: videoKeys.detail(videoId) });
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/videos/${videoId}/like`);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["likeStatus", videoId] });
      await queryClient.cancelQueries({ queryKey: videoKeys.detail(videoId) });

      const previousLikeStatus = queryClient.getQueryData(["likeStatus", videoId]);
      const previousVideoDetail = queryClient.getQueryData<Video>(videoKeys.detail(videoId));

      queryClient.setQueryData(["likeStatus", videoId], { isLiked: false });
      if (previousVideoDetail) {
        queryClient.setQueryData<Video>(videoKeys.detail(videoId), {
          ...previousVideoDetail,
          likeCount: Math.max(0, previousVideoDetail.likeCount - 1),
        });
      }

      return { previousLikeStatus, previousVideoDetail };
    },
    onError: (err, variables, context) => {
      if (context) {
        queryClient.setQueryData(["likeStatus", videoId], context.previousLikeStatus);
        queryClient.setQueryData(videoKeys.detail(videoId), context.previousVideoDetail);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["likeStatus", videoId] });
      queryClient.invalidateQueries({ queryKey: videoKeys.detail(videoId) });
    },
  });

  const toggleLike = () => {
    if (!isLoggedIn || isLiking) return;
    if (likeStatus?.isLiked) {
      unlikeMutation.mutate();
    } else {
      likeMutation.mutate();
    }
  };

  const isLiking = likeMutation.isPending || unlikeMutation.isPending;

  return {
    isLiked: likeStatus?.isLiked ?? false,
    isLoading,
    toggleLike,
    isLiking,
  };
}
