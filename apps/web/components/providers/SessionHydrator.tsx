"use client";

import { apiClient } from "@/lib/apiClient";
import { useAuthStore } from "@/store/auth/store";
import { useEffect } from "react";

export function SessionHydrator({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const response = await apiClient.get("/users/me");
        if (response.data.success) {
          setUser(response.data.data);
        } else {
          clearUser();
        }
      } catch {
        clearUser();
      }
    };

    hydrate();
  }, [setUser, clearUser]);

  return <>{children}</>;
}
