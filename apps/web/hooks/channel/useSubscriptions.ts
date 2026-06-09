"use client"

import { apiClient } from "@/lib/apiClient"
import { useQuery } from "@tanstack/react-query"
import type { Channel } from "@/types/video"

export type GetSubscriptionsResponse = {
  success: boolean
  data: Channel[]
}

async function fetchSubscriptions() {
  const response = await apiClient.get<GetSubscriptionsResponse>("/users/me/subscriptions")
  return response.data.data
}

export function useSubscriptions() {
  return useQuery({
    queryKey: ["subscriptions", "me"],
    queryFn: fetchSubscriptions,
  })
}
