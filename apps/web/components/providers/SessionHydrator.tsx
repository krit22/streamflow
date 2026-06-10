"use client";

import { apiClient } from "@/lib/apiClient";
import { useAuthStore } from "@/store/auth/store";
import { useEffect } from "react";

export function SessionHydrator({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  useEffect(() => {
    const hydrate = async () => {
      console.log("[SessionHydrator] Starting hydration...");
      try {
        const response = await apiClient.get("/users/me");
        console.log("[SessionHydrator] Response received:", response.data);
        if (response.data.success) {
          console.log("[SessionHydrator] User found, setting state.");
          setUser(response.data.data);
        } else {
          console.warn("[SessionHydrator] Success false, clearing user.");
          clearUser();
        }
      } catch (error) {
        console.error("[SessionHydrator] Hydration failed:", error);
        clearUser();
      }
    };

    hydrate();
  }, [setUser, clearUser]);

  return <>{children}</>;
}
