"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMe, sessionQueryKey } from "@/lib/session";
import { useAuthStore } from "@/store/useAuthStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);
  const setHydrated = useAuthStore((s) => s.setHydrated);

  const { data, isPending, isSuccess } = useQuery({
    queryKey: sessionQueryKey,
    queryFn: fetchMe,
    retry: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (isPending) return;

    if (isSuccess && data) {
      setUser({
        id: data.id,
        email: data.email,
        name: data.name,
      });
    } else {
      clearUser();
    }

    setHydrated(true);
  }, [isPending, isSuccess, data, setUser, clearUser, setHydrated]);

  return <>{children}</>;
}
