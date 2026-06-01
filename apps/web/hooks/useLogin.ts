import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { apiClient } from "@/lib/apiClient";
import type { ApiSuccessResponse, LoginResponseData } from "@/lib/api.types";
import { setAuthToken } from "@/lib/auth";
import type { LoginUserInput } from "@streamflow/validation";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: LoginUserInput) => {
      const response = await apiClient.post<
        ApiSuccessResponse<LoginResponseData>
      >("/users/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      setAuthToken(data.data.token);
      router.push("/");
    },
  });
}
