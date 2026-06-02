"use client";

import { useQueryClient } from "@tanstack/react-query";

import { VideoThumbnail } from "@/components/gallery/video-thumbnail";
import { MaterialIcon } from "@/components/ui/material-icon";
import type { FeedVideo } from "@/lib/api/types";
import { recordVideoView } from "@/lib/api/videos";
import { formatVideoMeta } from "@/lib/format";
import { queryKeys } from "@/lib/query/keys";
import { selectAuthUser, useAuthStore } from "@/stores/auth-store";

type VideoCardProps = {
  video: FeedVideo;
};

export function VideoCard({ video }: VideoCardProps) {
  const queryClient = useQueryClient();
  const user = useAuthStore(selectAuthUser);
  const meta = formatVideoMeta(video.viewsCount, video.createdAt);

  const handleOpen = () => {
    if (!user) {
      return;
    }

    void recordVideoView(video.id).then(() => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.history.all });
    });
  };

  return (
    <article
      className="gallery-card group cursor-pointer"
      onClick={handleOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleOpen();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="ambient-shadow relative mb-6 aspect-video overflow-hidden rounded-xl bg-surface-container-high transition-all duration-500">
        <VideoThumbnail src={video.thumbnailUrl} alt={video.title} />
        <div className="video-overlay absolute inset-0 flex items-center justify-center bg-primary/10 opacity-0 transition-opacity duration-300">
          <MaterialIcon
            name="play_arrow"
            filled
            className="text-5xl text-on-primary"
          />
        </div>
      </div>
      <div>
        <h3 className="mb-2 font-headline-lg text-[20px] font-bold leading-tight text-primary decoration-1 underline-offset-4 group-hover:underline">
          {video.title}
        </h3>
        <p className="mb-1 font-label-md text-label-md text-secondary">
          {video.channel?.name ?? "Unknown channel"}
        </p>
        <p className="font-body-md text-[12px] text-on-primary-container">{meta}</p>
      </div>
    </article>
  );
}
