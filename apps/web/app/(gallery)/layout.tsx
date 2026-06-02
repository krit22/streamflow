import { Hanken_Grotesk, Inter, Playfair_Display } from "next/font/google";
import { type ReactNode } from "react";

import "./gallery.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function GalleryLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${inter.variable} ${hankenGrotesk.variable} ${playfairDisplay.variable} flex min-h-screen flex-col overflow-x-hidden bg-background font-body-md text-on-background antialiased`}
    >
      {children}
    </div>
  );
}
