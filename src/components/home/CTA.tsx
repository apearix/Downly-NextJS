"use client";

import Link from "next/link";
import { ArrowDown, Link2, Film, Music, FileText, Play } from "lucide-react";
import { useState } from "react";

export function CTA() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 bg-primary">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[36px] bg-[#0B0F0D] border border-white/[0.06] shadow-2xl">
        {/* Ambient atmospheric glows */}
        <div className="pointer-events-none absolute -top-40 -left-40 h-[460px] w-[460px] rounded-full bg-[#74da03]/5 blur-[120px]" />
        <div className="pointer-events-none absolute -right-20 top-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#74da03]/[0.08] blur-[130px]" />

        {/* Micro-dot matrix background */}
        <div 
          className="pointer-events-none absolute inset-0 opacity-[0.03]" 
          style={{ backgroundImage: "radial-gradient(#FFF 1px, transparent 1px)", backgroundSize: "24px 24px" }} 
        />

        <div className="relative grid grid-cols-1 items-center gap-12 px-8 py-16 sm:px-14 sm:py-20 lg:grid-cols-12 lg:gap-8 lg:py-24">
          
          {/* Left Column: Editorial Content */}
          <div className="flex flex-col items-start lg:col-span-6 xl:col-span-7">
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-[#74da03]">
              Ready when you are
            </span>

            <h2 className="mt-4 text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Ready to pull down your media?
            </h2>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/50 sm:text-lg">
              Paste any link and download your media quickly, simply, and without the clutter.
            </p>

            <Link
              href="#download"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="group mt-10 inline-flex items-center gap-3 rounded-full bg-[#74da03] px-8 py-4 text-sm font-bold text-black transition-all duration-300 hover:bg-[#A3E600] hover:shadow-[0_12px_32px_rgba(116,218,3,0.25)] active:scale-[0.98]"
            >
              <span>Start downloading</span>
              <ArrowDown className="h-4 w-4 stroke-[2.5] transition-transform duration-300 group-hover:translate-y-1" />
            </Link>
          </div>

          {/* Right Column: Media Processing Engine Vector Canvas */}
          <div 
            className="relative flex items-center justify-center lg:col-span-6 xl:col-span-5"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative aspect-square w-full max-w-[440px] select-none flex items-center justify-center">
              
              {/* Orbital Connection Lines (SVG) */}
              <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 440 440">
                <circle cx="220" cy="220" r="140" fill="none" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                <circle cx="220" cy="220" r="190" fill="none" stroke="rgba(255,255,255,0.03)" />
                
                {/* Dynamic Energy Line to Arrow */}
                <line 
                  x1="220" y1="290" x2="220" y2="360" 
                  stroke={isHovered ? "#74da03" : "rgba(116,218,3,0.3)"} 
                  strokeWidth="1.5" 
                  strokeDasharray="4 4"
                  className="transition-all duration-500"
                />
              </svg>

              {/* 1. Orbiting Media Elements */}
              {/* Top Left: Link / Source */}
              <div className={`absolute top-10 left-12 flex items-center gap-2 rounded-xl bg-white/[0.03] border border-white/[0.08] px-3 py-2 backdrop-blur-md transition-transform duration-700 ${isHovered ? "translate-x-2 translate-y-2 border-[#74da03]/40" : "animate-pulse"}`}>
                <Link2 className="h-3.5 w-3.5 text-[#74da03]" />
                <span className="text-[10px] text-white/60 font-mono">link://raw</span>
              </div>

              {/* Top Right: Video Frame Fragment */}
              <div className={`absolute top-12 right-10 flex items-center gap-2 rounded-xl bg-white/[0.03] border border-white/[0.08] p-2.5 backdrop-blur-md transition-transform duration-700 ${isHovered ? "-translate-x-2 translate-y-2 border-[#74da03]/40" : ""}`}>
                <Film className="h-4 w-4 text-white/70" />
                <span className="text-[9px] font-mono text-[#74da03] bg-[#74da03]/10 px-1.5 py-0.5 rounded">4K</span>
              </div>

              {/* Middle Left: Audio Waveform Fragment */}
              <div className={`absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] px-3 py-2 backdrop-blur-md transition-transform duration-700 ${isHovered ? "translate-x-2" : ""}`}>
                <Music className="h-3.5 w-3.5 text-white/50" />
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 h-2 bg-[#74da03]/80 rounded-full animate-pulse" />
                  <span className="w-0.5 h-3 bg-[#74da03] rounded-full animate-pulse delay-75" />
                  <span className="w-0.5 h-1.5 bg-[#74da03]/60 rounded-full animate-pulse delay-150" />
                </div>
              </div>

              {/* Middle Right: Document / File Metadata */}
              <div className={`absolute right-4 top-1/2 -translate-y-1/2 rounded-xl bg-white/[0.03] border border-white/[0.08] p-2.5 backdrop-blur-md transition-transform duration-700 ${isHovered ? "-translate-x-2" : ""}`}>
                <FileText className="h-4 w-4 text-white/60" />
              </div>

              {/* 2. Central Floating Media Engine Core */}
              <div className={`relative z-10 w-64 rounded-2xl bg-[#111613] p-4 border transition-all duration-500 shadow-2xl ${isHovered ? "border-[#74da03]/50 shadow-[0_0_35px_rgba(116,218,3,0.15)] scale-[1.02]" : "border-white/[0.08]"}`}>
                {/* Media Window / Preview */}
                <div className="relative aspect-video w-full rounded-lg bg-[#0B0F0D] border border-white/[0.05] overflow-hidden flex items-center justify-center group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#74da03]/10 via-transparent to-transparent opacity-40" />
                  <div className="h-9 w-9 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center backdrop-blur-sm shadow-inner">
                    <Play className="h-3.5 w-3.5 fill-white text-white translate-x-0.5" />
                  </div>
                  <span className="absolute bottom-2 left-2 text-[9px] font-mono text-white/40">downly_stream.mp4</span>
                  <span className="absolute bottom-2 right-2 text-[9px] font-mono text-[#74da03]">60fps</span>
                </div>

                {/* Engine Processing Track & Live Waveform */}
                <div className="mt-3.5 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-white/50">
                    <span className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${isHovered ? "bg-[#74da03] animate-ping" : "bg-[#74da03]"}`} />
                      STREAM READY
                    </span>
                    <span className="text-white/40">100%</span>
                  </div>

                  {/* Processing Progress Bar */}
                  <div className="h-1 w-full rounded-full bg-white/[0.06] overflow-hidden">
                    <div className={`h-full bg-gradient-to-r from-[#74da03] to-[#D7FF66] transition-all duration-700 ${isHovered ? "w-full" : "w-3/4"}`} />
                  </div>
                </div>
              </div>

              {/* 3. Bottom Download Pipeline Target */}
              <div className={`absolute bottom-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#111613] border transition-all duration-500 shadow-lg ${isHovered ? "border-[#74da03] text-[#74da03] translate-y-1 shadow-[0_0_20px_rgba(116,218,3,0.3)]" : "border-white/[0.1] text-white/60"}`}>
                <ArrowDown className="h-4 w-4 stroke-[2.5]" />
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}