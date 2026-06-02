import type { GalleryNavItem } from "@/stores/gallery-ui-store";

export const GALLERY_NAV_ITEMS: Array<{
  id: GalleryNavItem;
  label: string;
  icon: string;
}> = [
  { id: "home", label: "Home", icon: "home" },
  { id: "history", label: "History", icon: "history" },
];

/** Sidebar width + main/footer offset (was w-64 / ml-64). */
export const GALLERY_SIDEBAR_WIDTH = "w-52";
export const GALLERY_SIDEBAR_OFFSET = "lg:ml-52";
