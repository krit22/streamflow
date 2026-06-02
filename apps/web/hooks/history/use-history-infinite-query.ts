"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { fetchHistoryPage } from "@/lib/api/history";
import { queryKeys } from "@/lib/query/keys";
import { selectAuthUser, useAuthStore } from "@/stores/auth-store";

const HISTORY_PAGE_SIZE = 12;

export function useHistoryInfiniteQuery() {
  const user = useAuthStore(selectAuthUser);

  return useInfiniteQuery({
    queryKey: queryKeys.history.list(HISTORY_PAGE_SIZE),
    queryFn: ({ pageParam }) =>
      fetchHistoryPage({
        limit: HISTORY_PAGE_SIZE,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: Boolean(user),
  });
}

export { HISTORY_PAGE_SIZE };
