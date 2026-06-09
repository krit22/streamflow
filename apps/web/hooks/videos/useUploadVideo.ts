import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

interface UploadVideoParams {
  title: string;
  description?: string;
  channelId: string;
  file: File;
  thumbnailFile: File;
  onProgress: (progress: number) => void;
}

/**
 * Hook to handle the 3-step video upload process:
 * 1. Initialize video record and get pre-signed URLs
 * 2. Upload video and thumbnail files directly to storage
 * 3. Finalize upload status
 */
export const useUploadVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, description, channelId, file, thumbnailFile, onProgress }: UploadVideoParams) => {
      // Step 1: Initialize the upload record and get pre-signed Supabase URLs
      const initResponse = await apiClient.post("/videos/initialize", {
        title,
        description,
        channelId,
        contentType: file.type,
        thumbnailContentType: thumbnailFile.type,
      });

      const { videoId, videoUploadUrl, thumbnailUploadUrl } = initResponse.data.data;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

      onProgress(5); 

      // Step 2: Upload both binary files directly to Supabase storage in parallel
      const [videoRes, thumbRes] = await Promise.all([
        fetch(videoUploadUrl, {
          method: "PUT",
          body: file,
          headers: { 
            "Content-Type": file.type,
            "apikey": supabaseKey || ""
          }
        }),
        fetch(thumbnailUploadUrl, {
          method: "PUT",
          body: thumbnailFile,
          headers: { 
            "Content-Type": thumbnailFile.type,
            "apikey": supabaseKey || ""
          }
        })
      ]);

      if (!videoRes.ok) throw new Error(`Video upload failed: ${videoRes.statusText}`);
      if (!thumbRes.ok) throw new Error(`Thumbnail upload failed: ${thumbRes.statusText}`);

      onProgress(85); 

      // Step 3: Finalize the upload on the backend to update status
      const finalizeResponse = await apiClient.post(`/videos/${videoId}/finalize`, {});
      
      onProgress(100);
      return finalizeResponse.data;
    },
    onSuccess: () => {
      // Refresh video lists after successful upload
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
};
