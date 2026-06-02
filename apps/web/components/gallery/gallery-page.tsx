"use client";

import { FeedHero } from "@/components/gallery/feed-hero";
import { GalleryShell } from "@/components/gallery/gallery-shell";
import { HistoryFeedGrid } from "@/components/gallery/history-feed-grid";
import { HistoryHero } from "@/components/gallery/history-hero";
import { VideoFeedGrid } from "@/components/gallery/video-feed-grid";
import { selectActiveNav, useGalleryUiStore } from "@/stores/gallery-ui-store";

export function GalleryPage() {
  const activeNav = useGalleryUiStore(selectActiveNav);

  return (
    <GalleryShell>
      <section className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
        {activeNav === "home" ? (
          <>
            <FeedHero />
            <VideoFeedGrid />
          </>
        ) : (
          <>
            <HistoryHero />
            <HistoryFeedGrid />
          </>
        )}
      </section>
    </GalleryShell>
  );
}
