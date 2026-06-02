import { create } from "zustand";

export type GalleryNavItem = "home" | "history";

type GalleryUiState = {
  activeNav: GalleryNavItem;
  isHeaderCompact: boolean;
  setActiveNav: (nav: GalleryNavItem) => void;
  setHeaderCompact: (compact: boolean) => void;
};

export const useGalleryUiStore = create<GalleryUiState>((set) => ({
  activeNav: "home",
  isHeaderCompact: false,
  setActiveNav: (activeNav) => set({ activeNav }),
  setHeaderCompact: (isHeaderCompact) => set({ isHeaderCompact }),
}));

export const selectActiveNav = (state: GalleryUiState) => state.activeNav;
export const selectIsHeaderCompact = (state: GalleryUiState) => state.isHeaderCompact;
