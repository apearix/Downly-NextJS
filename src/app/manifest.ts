import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Downly - Fast & Free Media Downloader",
    short_name: "Downly",
    description:
      "Universal YouTube Video (MP4) and Audio (MP3) Downloader. Clean, fast, and 100% free with no popup ads.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F8F6",
    theme_color: "#74da03",
    icons: [
      {
        src: "/favicon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/favicon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
