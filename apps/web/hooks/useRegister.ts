import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { apiClient } from "@/lib/apiClient";
import type { ApiSuccessResponse, RegisterResponseData } from "@/lib/api.types";
import type { RegisterUserInput } from "@streamflow/validation";

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: RegisterUserInput) => {
      const response = await apiClient.post<
        ApiSuccessResponse<RegisterResponseData>
      >("/users/register", data);
      return response.data;
    },
    onSuccess: () => {
      router.push("/login?registered=true");
    },
  });
}
