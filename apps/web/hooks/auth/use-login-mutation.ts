"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { loginUser } from "@/lib/api/auth";
import { queryKeys } from "@/lib/query/keys";
import { useAuthStore } from "@/stores/auth-store";
import type { LoginUserInput } from "@streamflow/validation";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (input: LoginUserInput) => loginUser(input),
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.setQueryData(queryKeys.auth.me(), data.user);
    },
  });
}
