import { create } from "zustand";

export type VideoUploadPhase =
  | "idle"
  | "initializing"
  | "uploading"
  | "finalizing"
  | "success"
  | "error";

type VideoUploadState = {
  file: File | null;
  isDragging: boolean;
  uploadProgress: number;
  phase: VideoUploadPhase;
  errorMessage: string | null;
  selectedChannelId: string | null;
  setFile: (file: File | null) => void;
  setIsDragging: (isDragging: boolean) => void;
  setUploadProgress: (progress: number) => void;
  setPhase: (phase: VideoUploadPhase) => void;
  setErrorMessage: (message: string | null) => void;
  setSelectedChannelId: (channelId: string | null) => void;
  reset: () => void;
};

const initialState = {
  file: null,
  isDragging: false,
  uploadProgress: 0,
  phase: "idle" as VideoUploadPhase,
  errorMessage: null,
  selectedChannelId: null,
};

export const useVideoUploadStore = create<VideoUploadState>((set) => ({
  ...initialState,
  setFile: (file) => set({ file }),
  setIsDragging: (isDragging) => set({ isDragging }),
  setUploadProgress: (uploadProgress) => set({ uploadProgress }),
  setPhase: (phase) => set({ phase }),
  setErrorMessage: (errorMessage) => set({ errorMessage }),
  setSelectedChannelId: (selectedChannelId) => set({ selectedChannelId }),
  reset: () => set(initialState),
}));
