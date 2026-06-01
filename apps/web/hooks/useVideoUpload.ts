import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getApiErrorMessage } from "@/lib/api-errors";
import { apiClient } from "@/lib/apiClient";
import type {
  ApiSuccessResponse,
  InitializeVideoUploadData,
} from "@/lib/api.types";
import { uploadFileWithProgress } from "@/lib/upload-file";
import { useVideoUploadStore } from "@/store/useVideoUploadStore";
import type { InitalizeVideoUploadInput } from "@streamflow/validation";

type VideoUploadPayload = InitalizeVideoUploadInput & {
  file: File;
};

export function useVideoUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, ...metadata }: VideoUploadPayload) => {
      const store = useVideoUploadStore.getState();

      store.setPhase("initializing");
      store.setUploadProgress(0);
      store.setErrorMessage(null);

      const initResponse = await apiClient.post<
        ApiSuccessResponse<InitializeVideoUploadData>
      >("/videos/initialize", metadata);

      const { videoId, uploadUrl } = initResponse.data.data;

      if (!uploadUrl) {
        throw new Error("No upload URL returned from the server.");
      }

      store.setPhase("uploading");

      await uploadFileWithProgress(file, uploadUrl, (percent) => {
        useVideoUploadStore.getState().setUploadProgress(percent);
      });

      store.setPhase("finalizing");

      await apiClient.post(`/videos/${videoId}/finalize`);

      return { videoId };
    },
    onSuccess: () => {
      const store = useVideoUploadStore.getState();
      store.setPhase("success");
      store.setUploadProgress(100);
      void queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
    onError: (error) => {
      const store = useVideoUploadStore.getState();
      store.setPhase("error");
      store.setErrorMessage(
        getApiErrorMessage(error, "Video upload failed."),
      );
    },
  });
}
