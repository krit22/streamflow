import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${process.env.BACKEND_API_URL || "https://streamflow-backend-eio1.onrender.com"}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
