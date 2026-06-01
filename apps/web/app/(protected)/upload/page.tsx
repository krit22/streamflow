import { VideoUploadForm } from "@/components/upload/VideoUploadForm";

export const metadata = {
  title: "Upload video | Streamflow",
  description: "Upload a new video to your channel",
};

export default function UploadPage() {
  return <VideoUploadForm />;
}
