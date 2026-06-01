import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { apiClient } from "@/lib/apiClient";
import type { ApiSuccessResponse, LoginResponseData } from "@/lib/api.types";
import type { LoginUserInput } from "@streamflow/validation";

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginUserInput) => {
      const response = await apiClient.post<
        ApiSuccessResponse<LoginResponseData>
      >("/users/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      useAuthStore.getState().setUser(data.data.user);
      queryClient.setQueryData(["session", "me"], data.data.user);
      router.push("/");
    },
  });
}
