import type { NextConfig } from "next";

const RENDER_BACKEND_URL = "https://downly-backend-cek2.onrender.com";

const nextConfig: NextConfig = {
  serverExternalPackages: ["youtube-dl-exec"],
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Range, Authorization",
          },
          {
            key: "Access-Control-Expose-Headers",
            value: "Content-Disposition, Content-Length, X-Filename",
          },
        ],
      },
    ];
  },
  async rewrites() {
    // When running on Vercel, proxy API calls to the Render backend service
    // so visitors on downly.apearix.com don't hit Vercel's missing python3/yt-dlp
    if (process.env.VERCEL === "1") {
      const backend = (
        process.env.NEXT_PUBLIC_API_URL || RENDER_BACKEND_URL
      ).replace(/\/$/, "");
      return [
        {
          source: "/api/:path*",
          destination: `${backend}/api/:path*`,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;