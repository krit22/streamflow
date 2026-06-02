"use client";

import { MaterialIcon } from "@/components/ui/material-icon";
import {
  GALLERY_NAV_ITEMS,
  GALLERY_SIDEBAR_WIDTH,
} from "@/lib/gallery/constants";
import { cn } from "@/lib/cn";
import { selectActiveNav, useGalleryUiStore } from "@/stores/gallery-ui-store";

export function GallerySidebar() {
  const activeNav = useGalleryUiStore(selectActiveNav);
  const setActiveNav = useGalleryUiStore((state) => state.setActiveNav);

  return (
    <aside
      className={cn(
        "fixed left-0 z-40 mt-20 hidden h-[calc(100vh-5rem)] flex-col bg-surface-container-lowest py-8 shadow-lg lg:flex",
        GALLERY_SIDEBAR_WIDTH,
      )}
    >
      <div className="mb-10 px-4">
        <h2 className="font-brand text-headline-lg-mobile text-primary">The Gallery</h2>
        <p className="font-label-md text-[12px] tracking-wide text-secondary">
          Curated Selection
        </p>
      </div>
      <nav className="flex-1 space-y-1">
        {GALLERY_NAV_ITEMS.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveNav(item.id)}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3 font-label-md text-[13px] transition-colors",
                isActive
                  ? "border-r-4 border-primary font-bold text-primary"
                  : "text-secondary-fixed-dim hover:text-primary",
              )}
            >
              <MaterialIcon name={item.icon} filled={isActive} className="text-[22px]" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
