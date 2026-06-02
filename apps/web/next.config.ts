import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { registerNextImageHostname } from "./lib/image";

const appDir = path.dirname(fileURLToPath(import.meta.url));

function getSupabaseImagePattern():
  | { protocol: "https"; hostname: string; pathname: string }
  | undefined {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    return undefined;
  }

  try {
    const hostname = new URL(supabaseUrl).hostname;
    registerNextImageHostname(hostname);
    return {
      protocol: "https",
      hostname,
      pathname: "/**",
    };
  } catch {
    return undefined;
  }
}

const supabasePattern = getSupabaseImagePattern();

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui"],
  turbopack: {
    root: path.join(appDir, "../.."),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      ...(supabasePattern ? [supabasePattern] : []),
    ],
  },
};

export default nextConfig;
