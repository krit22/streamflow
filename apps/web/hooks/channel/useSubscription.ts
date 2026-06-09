"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useAuth } from "@/hooks/auth/useAuth";
import { videoKeys } from "../videos/useVideos";
import { channelKeys } from "./useChannelProfile";
import { Video, Channel } from "@/types/video";

export function useSubscription(channelId: string, videoId?: string) {
  const { isLoggedIn } = useAuth();
  const queryClient = useQueryClient();

  const { data: subscriptionStatus, isLoading } = useQuery({
    queryKey: ["subscriptionStatus", channelId],
    queryFn: async () => {
      const response = await apiClient.get(`/channels/${channelId}/subscribe`);
      return response.data.data; // { isSubscribed: boolean }
    },
    enabled: isLoggedIn && !!channelId,
  });

  const subscribeMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post(`/channels/${channelId}/subscribe`);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["subscriptionStatus", channelId] });
      await queryClient.cancelQueries({ queryKey: channelKeys.profile(channelId) });
      if (videoId) {
        await queryClient.cancelQueries({ queryKey: videoKeys.detail(videoId) });
      }

      const previousSubscriptionStatus = queryClient.getQueryData(["subscriptionStatus", channelId]);
      const previousChannelProfile = queryClient.getQueryData<Channel>(channelKeys.profile(channelId));
      const previousVideoDetail = videoId ? queryClient.getQueryData<Video>(videoKeys.detail(videoId)) : undefined;

      queryClient.setQueryData(["subscriptionStatus", channelId], { isSubscribed: true });
      
      if (previousChannelProfile) {
        queryClient.setQueryData<Channel>(channelKeys.profile(channelId), {
          ...previousChannelProfile,
          subscriberCount: previousChannelProfile.subscriberCount + 1,
        });
      }

      if (previousVideoDetail && videoId) {
        queryClient.setQueryData<Video>(videoKeys.detail(videoId), {
          ...previousVideoDetail,
          channel: {
            ...previousVideoDetail.channel,
            subscriberCount: previousVideoDetail.channel.subscriberCount + 1,
          },
        });
      }

      return { previousSubscriptionStatus, previousVideoDetail, previousChannelProfile };
    },
    onError: (err, variables, context) => {
      if (context) {
        queryClient.setQueryData(["subscriptionStatus", channelId], context.previousSubscriptionStatus);
        queryClient.setQueryData(channelKeys.profile(channelId), context.previousChannelProfile);
        if (videoId) {
          queryClient.setQueryData(videoKeys.detail(videoId), context.previousVideoDetail);
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptionStatus", channelId] });
      queryClient.invalidateQueries({ queryKey: channelKeys.profile(channelId) });
      if (videoId) {
        queryClient.invalidateQueries({ queryKey: videoKeys.detail(videoId) });
      }
    },
  });

  const unsubscribeMutation = useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/channels/${channelId}/subscribe`);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["subscriptionStatus", channelId] });
      await queryClient.cancelQueries({ queryKey: channelKeys.profile(channelId) });
      if (videoId) {
        await queryClient.cancelQueries({ queryKey: videoKeys.detail(videoId) });
      }

      const previousSubscriptionStatus = queryClient.getQueryData(["subscriptionStatus", channelId]);
      const previousChannelProfile = queryClient.getQueryData<Channel>(channelKeys.profile(channelId));
      const previousVideoDetail = videoId ? queryClient.getQueryData<Video>(videoKeys.detail(videoId)) : undefined;

      queryClient.setQueryData(["subscriptionStatus", channelId], { isSubscribed: false });

      if (previousChannelProfile) {
        queryClient.setQueryData<Channel>(channelKeys.profile(channelId), {
          ...previousChannelProfile,
          subscriberCount: Math.max(0, previousChannelProfile.subscriberCount - 1),
        });
      }

      if (previousVideoDetail && videoId) {
        queryClient.setQueryData<Video>(videoKeys.detail(videoId), {
          ...previousVideoDetail,
          channel: {
            ...previousVideoDetail.channel,
            subscriberCount: Math.max(0, previousVideoDetail.channel.subscriberCount - 1),
          },
        });
      }

      return { previousSubscriptionStatus, previousVideoDetail, previousChannelProfile };
    },
    onError: (err, variables, context) => {
      if (context) {
        queryClient.setQueryData(["subscriptionStatus", channelId], context.previousSubscriptionStatus);
        queryClient.setQueryData(channelKeys.profile(channelId), context.previousChannelProfile);
        if (videoId) {
          queryClient.setQueryData(videoKeys.detail(videoId), context.previousVideoDetail);
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptionStatus", channelId] });
      queryClient.invalidateQueries({ queryKey: channelKeys.profile(channelId) });
      if (videoId) {
        queryClient.invalidateQueries({ queryKey: videoKeys.detail(videoId) });
      }
    },
  });

  const toggleSubscription = () => {
    if (!isLoggedIn || isSubscribing) return;
    if (subscriptionStatus?.isSubscribed) {
      unsubscribeMutation.mutate();
    } else {
      subscribeMutation.mutate();
    }
  };

  const isSubscribing = subscribeMutation.isPending || unsubscribeMutation.isPending;

  return {
    isSubscribed: subscriptionStatus?.isSubscribed ?? false,
    isLoading,
    toggleSubscription,
    isSubscribing,
  };
}
