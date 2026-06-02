import { GalleryPage } from "@/components/gallery/gallery-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stream Flow - The Gallery",
  description: "Curated visual storytelling from leading contemporary cinematographers.",
};

export default function HomePage() {
  return <GalleryPage />;
}
