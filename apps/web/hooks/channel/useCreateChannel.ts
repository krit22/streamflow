import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { createChannelInput } from "@streamflow/validation";
import { useAuthStore } from "@/store/auth/store";

export function useCreateChannel() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (data: createChannelInput) => {
      const response = await apiClient.post("/channels/createchannel", data);
      return response.data;
    },
    onSuccess: async () => {
      // Refresh user data to get the newly created channel
      try {
        const response = await apiClient.get("/users/me");
        if (response.data.success) {
          setUser(response.data.data);
        }
      } catch (error) {
        console.error("Failed to refresh user data after channel creation", error);
      }
      
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
