import { apiRequest } from "@/lib/api/client";
import type { AuthSession, AuthUser, MeUser } from "@/lib/api/types";
import type { LoginUserInput, RegisterUserInput } from "@streamflow/validation";

export async function registerUser(input: RegisterUserInput): Promise<AuthSession> {
  return apiRequest<AuthSession>("/users/register", {
    method: "POST",
    body: input,
  });
}

export async function loginUser(input: LoginUserInput): Promise<AuthSession> {
  return apiRequest<AuthSession>("/users/login", {
    method: "POST",
    body: input,
  });
}

export async function logoutUser(): Promise<void> {
  await apiRequest<Record<string, never>>("/users/logout", {
    method: "POST",
  });
}

export async function getCurrentUser(): Promise<MeUser> {
  return apiRequest<MeUser>("/users/me");
}

export type { AuthUser, MeUser };
