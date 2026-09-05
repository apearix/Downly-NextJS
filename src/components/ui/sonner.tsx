"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type ToastType = "success" | "error" | "info" | "loading";

export interface ToastItem {
  id: string;
  message: string;
  description?: string;
  type: ToastType;
  duration?: number;
}

type ToastListener = (toasts: ToastItem[]) => void;

let listeners: ToastListener[] = [];
let toasts: ToastItem[] = [];

function notify() {
  listeners.forEach((listener) => listener([...toasts]));
}

export const toast = {
  success: (message: string, options?: { description?: string; duration?: number }) => {
    const id = Math.random().toString(36).substring(2, 9);
    const item: ToastItem = {
      id,
      message,
      description: options?.description,
      type: "success",
      duration: options?.duration ?? 4000,
    };
    toasts = [item, ...toasts.slice(0, 4)];
    notify();
    return id;
  },
  error: (message: string, options?: { description?: string; duration?: number }) => {
    const id = Math.random().toString(36).substring(2, 9);
    const item: ToastItem = {
      id,
      message,
      description: options?.description,
      type: "error",
      duration: options?.duration ?? 5000,
    };
    toasts = [item, ...toasts.slice(0, 4)];
    notify();
    return id;
  },
  info: (message: string, options?: { description?: string; duration?: number }) => {
    const id = Math.random().toString(36).substring(2, 9);
    const item: ToastItem = {
      id,
      message,
      description: options?.description,
      type: "info",
      duration: options?.duration ?? 4000,
    };
    toasts = [item, ...toasts.slice(0, 4)];
    notify();
    return id;
  },
  loading: (message: string, options?: { description?: string }) => {
    const id = Math.random().toString(36).substring(2, 9);
    const item: ToastItem = {
      id,
      message,
      description: options?.description,
      type: "loading",
      duration: 0,
    };
    toasts = [item, ...toasts.slice(0, 4)];
    notify();
    return id;
  },
  dismiss: (id?: string) => {
    if (id) {
      toasts = toasts.filter((t) => t.id !== id);
    } else {
      toasts = [];
    }
    notify();
  },
};

export function Toaster({ position = "top-right" }: { position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    const listener: ToastListener = (updated) => setItems(updated);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  useEffect(() => {
    const timeouts = items.map((item) => {
      if (item.duration && item.duration > 0) {
        return setTimeout(() => {
          toast.dismiss(item.id);
        }, item.duration);
      }
      return null;
    });

    return () => {
      timeouts.forEach((t) => t && clearTimeout(t));
    };
  }, [items]);

  const positionClasses = {
    "top-right": "top-4 right-4 items-end",
    "top-left": "top-4 left-4 items-start",
    "bottom-right": "bottom-4 right-4 items-end",
    "bottom-left": "bottom-4 left-4 items-start",
  }[position];

  return (
    <div
      aria-live="polite"
      className={`fixed z-[9999] pointer-events-none flex flex-col gap-2.5 p-2 max-w-sm w-full ${positionClasses}`}
    >
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            className={`pointer-events-auto flex items-start gap-3.5 w-full p-4 rounded-2xl border backdrop-blur-xl transition-all ${
              item.type === "error"
                ? "bg-[#0B0F0D]/95 border-red-500/35 text-white shadow-[0_12px_32px_-6px_rgba(239,68,68,0.25)]"
                : item.type === "success"
                ? "bg-[#0B0F0D]/95 border-[rgba(116,218,3,0.35)] text-white shadow-[0_12px_32px_-6px_rgba(116,218,3,0.25)]"
                : "bg-[#0B0F0D]/95 border-white/15 text-white shadow-[0_12px_32px_-6px_rgba(0,0,0,0.4)]"
            }`}
          >
            {item.type === "success" && (
              <div className="h-7 w-7 rounded-xl bg-[#74da03]/15 border border-[#74da03]/30 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="h-4 w-4 text-[#74da03]" />
              </div>
            )}
            {item.type === "error" && (
              <div className="h-7 w-7 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <AlertCircle className="h-4 w-4 text-red-400" />
              </div>
            )}
            {item.type === "info" && (
              <div className="h-7 w-7 rounded-xl bg-[#74da03]/15 border border-[#74da03]/30 flex items-center justify-center shrink-0 mt-0.5">
                <Info className="h-4 w-4 text-[#74da03]" />
              </div>
            )}
            {item.type === "loading" && (
              <div className="h-7 w-7 rounded-xl bg-[#74da03]/15 border border-[#74da03]/30 flex items-center justify-center shrink-0 mt-0.5">
                <Loader2 className="h-4 w-4 text-[#74da03] animate-spin" />
              </div>
            )}

            <div className="flex-1 min-w-0 pt-0.5">
              <p className="text-xs sm:text-sm font-semibold tracking-tight text-white leading-tight">
                {item.message}
              </p>
              {item.description && (
                <p className={`text-[12px] mt-1 leading-snug ${item.type === "error" ? "text-red-300" : "text-white/70"}`}>
                  {item.description}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => toast.dismiss(item.id)}
              className="p-1 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition shrink-0"
              aria-label="Close notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
