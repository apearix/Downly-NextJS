"use client";

import { useState } from "react";
import { FAQ_ITEMS } from "@/lib/seo/schema";
import { ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const toggleFAQ = (idx: number) => {
    setOpenIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative overflow-hidden bg-background py-20"
    >
      {/* Persistent Animated Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden"
      >
        {/* Subtle Ambient Depth Base (Never disappears, soft SaaS glow) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,var(--color-primary,theme(colors.primary))_0%,transparent_45%),radial-gradient(circle_at_85%_75%,var(--color-primary,theme(colors.primary))_0%,transparent_50%)] opacity-[0.06]" />

        {/* Top-Left Ambient Orb - Constant 12% Opacity */}
        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  x: [-25, 20, -15, -25],
                  y: [-15, 25, -10, -15],
                  scale: [1, 1.08, 0.96, 1],
                }
          }
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-20 -left-20 h-[30rem] w-[30rem] rounded-full bg-primary/80 blur-3xl will-change-transform"
        />

        {/* Bottom-Right Ambient Orb - Constant 10% Opacity */}
        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  x: [25, -25, 15, 25],
                  y: [20, -25, 15, 20],
                  scale: [0.96, 1.08, 1, 0.96],
                }
          }
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
          className="absolute -bottom-24 -right-20 h-[34rem] w-[34rem] rounded-full bg-primary/40 blur-3xl will-change-transform"
        />

        {/* Mid-Left Flowing Wave & Network Paths - Stable Line Visibility */}
        <motion.svg
          viewBox="0 0 600 600"
          fill="none"
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  y: [-12, 16, -12],
                  rotate: [-1, 2, -1],
                }
          }
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-16 top-1/4 h-[36rem] w-[36rem] text-primary will-change-transform"
        >
          <path
            d="M-50,150 C120,80 180,320 340,240 C430,195 500,280 580,260"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 6"
          />
          <path
            d="M-30,300 C150,220 220,440 400,360 C480,320 540,410 620,380"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <circle cx="340" cy="240" r="3.5" fill="currentColor" opacity="0.9" />
          <circle cx="180" cy="320" r="2.5" fill="currentColor" opacity="0.8" />
          <circle cx="400" cy="360" r="4" fill="currentColor" opacity="0.9" />
        </motion.svg>

        {/* Right Flowing Data Stream - Stable Line Visibility */}
        <motion.svg
          viewBox="0 0 500 700"
          fill="none"
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  y: [16, -20, 16],
                  rotate: [1.5, -1.5, 1.5],
                }
          }
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute -right-20 top-10 h-[40rem] w-[40rem] text-primary/80 will-change-transform"
        >
          <path
            d="M60,40 C180,160 80,320 220,440 C340,540 260,620 440,680"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path
            d="M140,20 C260,180 160,340 300,460 C400,550 360,630 490,670"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="5 7"
          />
          <circle cx="220" cy="440" r="3.5" fill="currentColor" opacity="0.9" />
          <circle cx="300" cy="460" r="3" fill="currentColor" opacity="0.8" />
          <circle cx="80" cy="320" r="2.5" fill="currentColor" opacity="0.9" />
        </motion.svg>

        {/* Constant Visible Micro Nodes (No fading, constant slow drift) */}
        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  y: [-10, 10, -10],
                  x: [-4, 6, -4],
                }
          }
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/3 left-[10%] h-2 w-2 rounded-full bg-primary shadow-sm will-change-transform"
        />

        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  y: [8, -12, 8],
                  x: [4, -5, 4],
                }
          }
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-2/3 right-[12%] h-2.5 w-2.5 rounded-full bg-primary/80 shadow-sm will-change-transform"
        />

        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  y: [-10, 8, -10],
                  x: [-3, 5, -3],
                }
          }
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
          className="absolute top-[82%] left-[16%] h-1.5 w-1.5 rounded-full bg-primary shadow-sm will-change-transform"
        />

        {/* Subtle Static Ambient Accent in Middle-Right Area */}
        <div className="absolute top-[45%] -right-10 h-72 w-72 rounded-full bg-primary/60 blur-3xl" />
      </div>

      {/* Existing FAQ Content */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">
            Got Questions?
          </p>

          <h2
            id="faq-heading"
            className="mt-4 text-4xl font-bold tracking-tight text-heading sm:text-5xl"
          >
            Downly, <span className="text-primary">Explained.</span>
          </h2>

          <p className="mt-4 text-base leading-relaxed text-body sm:text-lg">
            Everything you need to know about high-speed video downloads, audio conversion, and supported formats.
          </p>
        </div>

        {/* Accordion List */}
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIdx === idx;

            return (
              <div
                key={idx}
                className={`group rounded-2xl border bg-surface p-4 shadow-xs transition-all duration-300 hover:border-border-accent ${
                  isOpen
                    ? "border-border-accent shadow-lg shadow-glow/10"
                    : "border-border"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(idx)}
                  className="flex w-full cursor-pointer list-none items-center justify-between gap-4 text-left font-medium text-base text-heading select-none"
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 group-hover:bg-primary/80 group-hover:text-heading ${
                      isOpen
                        ? "rotate-180 bg-heading text-primary"
                        : "bg-surface-alt text-body"
                    }`}
                  >
                    <ChevronDown className="h-4 w-4 stroke-[2.5]" />
                  </span>
                </button>

                {/* Smooth Height Transition */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="mt-2 border-t border-slate-200 pt-2 text-sm leading-relaxed text-body">
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}