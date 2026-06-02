import Image from "next/image";

import { MaterialIcon } from "@/components/ui/material-icon";
import { cn } from "@/lib/cn";
import { isNextImageHostnameAllowed } from "@/lib/image";

type VideoThumbnailProps = {
  src: string | null;
  alt: string;
};

export function VideoThumbnail({ src, alt }: VideoThumbnailProps) {
  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-surface-container-high">
        <MaterialIcon name="play_circle" className="text-5xl text-on-primary-container" />
      </div>
    );
  }

  if (isNextImageHostnameAllowed(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        className="gallery-card-image object-cover transition-transform duration-700"
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- fallback for thumbnail hosts not in next.config
    <img
      src={src}
      alt={alt}
      className={cn(
        "gallery-card-image absolute inset-0 h-full w-full object-cover transition-transform duration-700",
      )}
    />
  );
}
