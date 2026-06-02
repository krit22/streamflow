"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { getCurrentUser } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/errors";
import { queryKeys } from "@/lib/query/keys";
import { useAuthStore } from "@/stores/auth-store";

export function useMeQuery(enabled = true) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  const query = useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: getCurrentUser,
    enabled,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 401) {
        return false;
      }
      return failureCount < 1;
    },
  });

  useEffect(() => {
    if (query.data) {
      setUser({
        id: query.data.id,
        email: query.data.email,
        name: query.data.name,
      });
      return;
    }

    if (query.isError && query.error instanceof ApiError && query.error.status === 401) {
      clearUser();
    }
  }, [query.data, query.isError, query.error, setUser, clearUser]);

  return query;
}
