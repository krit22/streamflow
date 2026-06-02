"use client";

import { type ReactNode } from "react";

import { GalleryFooter } from "@/components/gallery/gallery-footer";
import { GalleryHeader } from "@/components/gallery/gallery-header";
import { GalleryMobileNav } from "@/components/gallery/gallery-mobile-nav";
import { GallerySidebar } from "@/components/gallery/gallery-sidebar";
import { GALLERY_SIDEBAR_OFFSET } from "@/lib/gallery/constants";
import { cn } from "@/lib/cn";

type GalleryShellProps = {
  children: ReactNode;
};

export function GalleryShell({ children }: GalleryShellProps) {
  return (
    <>
      <GalleryHeader />
      <GallerySidebar />
      <main
        className={cn(
          "min-h-screen pb-24 pt-32 lg:pb-16",
          GALLERY_SIDEBAR_OFFSET,
        )}
      >
        {children}
      </main>
      <GalleryFooter />
      <GalleryMobileNav />
    </>
  );
}
