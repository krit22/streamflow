import { Hanken_Grotesk, Inter } from "next/font/google";
import { type ReactNode } from "react";

import "./auth.css";

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

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${inter.variable} ${hankenGrotesk.variable} flex min-h-screen flex-col bg-background font-body-md text-on-background`}
    >
      {children}
    </div>
  );
}
