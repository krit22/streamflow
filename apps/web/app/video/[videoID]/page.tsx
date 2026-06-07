import VideoPlaterTopbar from "@/components/ui/videoPlayerTopbar";
import VideosTopbar from "@/components/ui/videosTopbar";
import { VideoDetailContent } from "@/components/video/VideoDetailContent";

export default async function VideoPage({ params }: { params: Promise<{ videoID: string }> }) {
  const { videoID } = await params;

  return <>
    <VideoPlaterTopbar />
    <VideoDetailContent videoID={videoID} />
  </>;
}
