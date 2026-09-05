import type { Metadata, Viewport } from "next";
import { Google_Sans_Flex, Inter } from "next/font/google";
import { SITE_URL } from "@/lib/seo/schema";
import "./globals.css";

const googleSansFlex = Google_Sans_Flex({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "700",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["system-ui", "sans-serif"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#74da03",
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Downly : Fast & Free Media Downloader | 1080p, 4K & MP3",
    template: "%s | Downly",
  },
  description:
    "Downly is a clean, free online media downloader. Download YouTube videos in 1080p Full HD & 4K MP4, or extract 320kbps MP3 audio with instant processing, zero popup ads, and no software required.",
  applicationName: "Downly",
  authors: [{ name: "Downly Team", url: SITE_URL }],
  generator: "Next.js",
  keywords: [
    "youtube video downloader",
    "download youtube mp4",
    "youtube to mp3 converter",
    "4k video downloader",
    "1080p video downloader",
    "free online media downloader",
    "no ads youtube downloader",
    "mobile video downloader",
    "fast media converter",
    "downly",
  ],
  creator: "Downly",
  publisher: "Downly",
  category: "MultimediaApplication",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Downly — Fast & Free Media Downloader | 1080p, 4K & MP3",
    description:
      "Universal YouTube Video (1080p/4K MP4) and Audio (HQ MP3) downloader. Zero popup ads, zero software, 100% free and private.",
    url: SITE_URL,
    siteName: "Downly",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Downly — Fast & Free Media Downloader",
    description:
      "Universal YouTube Video (1080p/4K MP4) and Audio (HQ MP3) downloader. Clean, fast, and ad-free.",
    creator: "@downly",
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [
      { url: "/favicon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
        <link rel="preconnect" href="https://i.ytimg.com" crossOrigin="anonymous" />
      </head>
      <body className={`${googleSansFlex.variable} ${inter.variable}`}>
        {children}
      </body>
    </html>
  );
}