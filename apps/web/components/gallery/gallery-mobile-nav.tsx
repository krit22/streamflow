"use client";

import { MaterialIcon } from "@/components/ui/material-icon";
import { GALLERY_NAV_ITEMS } from "@/lib/gallery/constants";
import { cn } from "@/lib/cn";
import { selectActiveNav, useGalleryUiStore } from "@/stores/gallery-ui-store";

export function GalleryMobileNav() {
  const activeNav = useGalleryUiStore(selectActiveNav);
  const setActiveNav = useGalleryUiStore((state) => state.setActiveNav);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-20 items-center justify-around border-t border-outline-variant/10 bg-background/95 backdrop-blur-md lg:hidden">
      {GALLERY_NAV_ITEMS.map((item) => {
        const isActive = activeNav === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveNav(item.id)}
            className={cn(
              "flex flex-col items-center gap-1",
              isActive ? "text-primary" : "text-secondary",
            )}
          >
            <MaterialIcon name={item.icon} filled={isActive} />
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
