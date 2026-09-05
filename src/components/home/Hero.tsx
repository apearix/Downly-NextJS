"use client";

import { DownloadBox } from "./DownloadBox";

export function Hero() {
  return (
    <section
      id="home"
      aria-label="Media Downloader Hero"
      className="relative bg-primary flex min-h-screen items-end justify-center overflow-hidden pt-28 pb-20 "
    >
      {/* Background Decorative Tech Grid */}
      <div 
        className="pointer-events-none absolute inset-0 -z-20 opacity-[0.35] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]"
        style={{
          backgroundImage: "radial-gradient(rgba(11,15,13,0.12) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Atmospheric Ambient Glows */}
      <div className="pointer-events-none absolute left-1/2 top-12 -z-10 h-[550px] w-[920px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#B6FF00]/25 via-[#D7FF66]/15 to-transparent blur-[140px]" />
      <div className="pointer-events-none absolute -left-48 top-1/3 -z-10 h-72 w-72 rounded-full bg-[#B6FF00]/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-48 top-1/4 -z-10 h-80 w-80 rounded-full bg-[#B6FF00]/10 blur-[110px]" />

      <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="mx-auto   text-center">

          
          {/* Core Kinetic Headline */}
          <h1 className="mt-8 text-5xl font-bold  leading-[1.04] tracking-[-0.045em] text-[#0B0F0D] sm:text-6xl lg:text-7xl xl:text-8xl">
            <span className="text-white">Download</span> media.
            <span className="relative mx-auto mt-1 block w-fit">
              <span className="relative z-10 bg-gradient-to-r from-[#0B0F0D] via-[#2c3b34] to-[#9db4a9] bg-clip-text text-transparent">
                Simply. Fast.
              </span>
              <span className="absolute -bottom-1.5 left-0 right-0 -z-0 h-3.5 w-full -rotate-1 rounded-sm bg-[#B6FF00]/70" />
            </span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto mt-8 text-lg font-normal leading-relaxed text-[#4A5550]   text-balance">
            Downly strips out ads and redirects to keep your flow clean. Download YouTube videos in 1080p/4K MP4 or extract crystal-clear MP3 audio instantly.
          </p>

          {/* Interactive Core Downloader Box */}
          <div className="relative ">
            <DownloadBox />
          </div> 
        </div>
      </div>
    </section>
  );
}