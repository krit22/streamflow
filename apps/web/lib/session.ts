import { apiClient } from "@/lib/apiClient";
import type { ApiSuccessResponse, MeResponseData } from "@/lib/api.types";

export const sessionQueryKey = ["session", "me"] as const;

export async function fetchMe(): Promise<MeResponseData> {
  const response = await apiClient.get<ApiSuccessResponse<MeResponseData>>(
    "/users/me",
  );
  return response.data.data;
}
