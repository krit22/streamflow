import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { ApiSuccessResponse, CreateChannelData } from "@/lib/api.types";
import { sessionQueryKey } from "@/lib/session";
import type { createChannelInput } from "@streamflow/validation";

export function useCreateChannel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: createChannelInput) => {
      const response = await apiClient.post<
        ApiSuccessResponse<CreateChannelData>
      >("/channels/createchannel", data);
      return response.data.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: sessionQueryKey });
    },
  });
}
