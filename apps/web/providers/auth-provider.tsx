"use client";

import { type ReactNode } from "react";

import { useMeQuery } from "@/hooks/auth";

type AuthProviderProps = {
  children: ReactNode;
};

/** Hydrates auth state from the HttpOnly session cookie via GET /users/me */
export function AuthProvider({ children }: AuthProviderProps) {
  useMeQuery();
  return children;
}
