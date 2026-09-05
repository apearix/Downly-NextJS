"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { 
  Link2, 
  ArrowDown, 
  Clipboard, 
  Check, 
  X, 
  Loader2, 
  Music2,
  SlidersHorizontal,
  Video,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  User as UserIcon
} from "lucide-react";
import type { JobPublicDto } from "@/lib/types/job";

type MediaType = "video" | "audio";

interface QualityOption {
  id: string;
  label: string;
  height: number;
}

interface MediaMetadata {
  title: string;
  thumbnail?: string;
  duration?: number;
  channel?: string;
  qualities: QualityOption[];
}

const DEFAULT_VIDEO_QUALITIES: QualityOption[] = [
  { id: "1080p", label: "1080p FHD", height: 1080 },
  { id: "720p", label: "720p HD", height: 720 },
  { id: "480p", label: "480p", height: 480 },
  { id: "360p", label: "360p", height: 360 },
];

function formatDuration(seconds?: number): string {
  if (!seconds || isNaN(seconds)) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function DownloadBox() {
  const [url, setUrl] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaType, setMediaType] = useState<MediaType>("video");
  const [quality, setQuality] = useState<string>("1080p");
  const [mediaInfo, setMediaInfo] = useState<MediaMetadata | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active Job & Real Progress State
  const [activeJob, setActiveJob] = useState<JobPublicDto | null>(null);
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Platform auto-detection
  const getPlatform = (value: string) => {
    const val = value.toLowerCase();
    if (val.includes("youtube.com") || val.includes("youtu.be")) {
      return { name: "YouTube", icon: Video, color: "text-red-500" };
    }
    if (val.includes("instagram.com")) {
      return { name: "Instagram", icon: Video, color: "text-pink-500" };
    }
    if (val.includes("twitter.com") || val.includes("x.com")) {
      return { name: "X / Twitter", icon: Video, color: "text-sky-500" };
    }
    if (val.includes("soundcloud.com") || val.includes("spotify.com")) {
      return { name: "Audio", icon: Music2, color: "text-[#74da03]" };
    }
    return null;
  };

  const detectedPlatform = getPlatform(url);

  // Dynamic API base for hybrid Vercel + Render/VPS deployment
  const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

  // Clear polling timer on unmount
  useEffect(() => {
    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
      }
    };
  }, []);

  // Poll active job status
  const startPollingJob = useCallback((jobId: string) => {
    if (pollTimerRef.current) clearInterval(pollTimerRef.current);

    pollTimerRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/jobs/${jobId}`);
        if (!res.ok) {
          throw new Error("Unable to check download progress.");
        }
        const data = await res.json();
        const job: JobPublicDto = data.job;
        setActiveJob(job);

        if (job.status === "completed") {
          if (pollTimerRef.current) clearInterval(pollTimerRef.current);
          setIsSubmitting(false);

          // Automatically trigger file download
          if (job.downloadUrl) {
            const link = document.createElement("a");
            const downloadHref = job.downloadUrl.startsWith("http")
              ? job.downloadUrl
              : `${API_BASE}${job.downloadUrl}`;
            link.href = downloadHref;
            link.download = job.filename || "downly-media";
            document.body.appendChild(link);
            link.click();
            link.remove();
          }
        } else if (job.status === "failed") {
          if (pollTimerRef.current) clearInterval(pollTimerRef.current);
          setIsSubmitting(false);
          setErrorMsg(job.error || "Download failed. Please try again.");
        } else if (job.status === "cancelled") {
          if (pollTimerRef.current) clearInterval(pollTimerRef.current);
          setIsSubmitting(false);
          setActiveJob(null);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 800);
  }, [API_BASE]);

  // Debounced URL metadata analysis
  useEffect(() => {
    const trimmed = url.trim();
    if (
      !trimmed ||
      (!trimmed.includes("youtube.com") && !trimmed.includes("youtu.be"))
    ) {
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      setIsAnalyzing(true);
      setErrorMsg(null);

      try {
        const res = await fetch(`${API_BASE}/api/info?url=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          throw new Error(errData?.error || "Could not inspect video.");
        }

        const data = await res.json();
        if (data?.qualities && Array.isArray(data.qualities) && data.qualities.length > 0) {
          setMediaInfo({
            title: data.title || "YouTube Media",
            thumbnail: data.thumbnail,
            duration: data.duration,
            channel: data.channel,
            qualities: data.qualities,
          });

          // Ensure selected quality is available or fallback to best
          const hasCurrent = data.qualities.some((q: QualityOption) => q.id === quality);
          if (!hasCurrent) {
            const highest = [...data.qualities].sort((a: QualityOption, b: QualityOption) => b.height - a.height)[0];
            if (highest) setQuality(highest.id);
          }
        }
      } catch (err: unknown) {
        const error = err as { name?: string; message?: string };
        if (error?.name !== "AbortError") {
          console.warn("Could not fetch formats:", err);
        }
      } finally {
        setIsAnalyzing(false);
      }
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [url, quality, API_BASE]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;
    setUrl(nextVal);
    setErrorMsg(null);
    const trimmed = nextVal.trim();
    if (!trimmed || (!trimmed.includes("youtube.com") && !trimmed.includes("youtu.be"))) {
      setMediaInfo(null);
      setIsAnalyzing(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        setIsCopied(true);
        setErrorMsg(null);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch {
      inputRef.current?.focus();
    }
  };

  const handleClear = () => {
    setUrl("");
    setMediaInfo(null);
    setIsAnalyzing(false);
    setErrorMsg(null);
    if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    setActiveJob(null);
    setIsSubmitting(false);
    inputRef.current?.focus();
  };

  const handleCancelJob = async () => {
    if (!activeJob?.id) return;
    try {
      await fetch(`${API_BASE}/api/jobs/${activeJob.id}`, { method: "DELETE" });
    } catch {}
    if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    setActiveJob(null);
    setIsSubmitting(false);
  };

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const response = await fetch(`${API_BASE}/api/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          type: mediaType,
          quality: mediaType === "video" ? quality : "best",
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Failed to initiate download.");
      }

      if (data?.jobId && data?.job) {
        setActiveJob(data.job);
        startPollingJob(data.jobId);
      } else {
        throw new Error("Invalid server response.");
      }
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      setErrorMsg(
        error instanceof Error ? error.message : "Something went wrong. Please try again."
      );
    }
  };

  const displayQualities =
    mediaInfo?.qualities && mediaInfo.qualities.length > 0
      ? mediaInfo.qualities
      : DEFAULT_VIDEO_QUALITIES;

  const isJobRunning = Boolean(
    activeJob &&
      (activeJob.status === "queued" ||
        activeJob.status === "analyzing" ||
        activeJob.status === "downloading" ||
        activeJob.status === "processing")
  );

  return (
    <div id="download" className="relative mx-auto mt-8 max-w-3xl">
      {/* Dynamic Back-Glow */}
      <div 
        className={`absolute -inset-1.5 rounded-[32px] bg-gradient-to-r from-[#74da03]/30 via-[#D7FF66]/20 to-[#74da03]/30 blur-2xl transition-opacity duration-500 pointer-events-none ${
          isFocused || isJobRunning ? "opacity-100" : "opacity-45"
        }`} 
      />

      <div className="relative rounded-[28px] border border-[rgba(11,15,13,0.1)] bg-white p-3 sm:p-3.5 shadow-[0_20px_60px_-15px_rgba(11,15,13,0.08)] transition-all">
        
        {/* Main URL Bar */}
        <form onSubmit={handleDownload} className="flex flex-col gap-2.5 sm:flex-row">
          <div 
            className={`group relative flex min-w-0 flex-1 items-center gap-3 rounded-2xl border px-4 py-1.5 transition-all duration-200 ${
              isFocused 
                ? "border-[#0B0F0D] bg-white ring-4 ring-[#74da03]/15" 
                : "border-[rgba(11,15,13,0.06)] bg-[#F7F8F6]/60 hover:bg-[#F7F8F6]"
            }`}
          >
            {/* Left status / platform icon */}
            {detectedPlatform ? (
              <div className="flex h-7 items-center gap-1.5 rounded-lg bg-black px-2 py-0.5 text-[11px] font-bold text-white shadow-xs shrink-0">
                <detectedPlatform.icon className={`h-3.5 w-3.5 ${detectedPlatform.color}`} />
                <span className="hidden sm:inline">{detectedPlatform.name}</span>
              </div>
            ) : (
              <Link2 className={`h-5 w-5 shrink-0 transition-colors ${isFocused ? "text-[#0B0F0D]" : "text-[#738079]"}`} />
            )}

            {/* Input field */}
            <input
              ref={inputRef}
              type="url"
              value={url}
              disabled={isJobRunning}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={handleUrlChange}
              placeholder="Paste YouTube video or audio link..."
              required
              aria-label="Media URL input"
              className="h-12 sm:h-13 min-w-0 flex-1 bg-transparent text-sm font-medium text-[#0B0F0D] outline-none placeholder:text-[#738079]/70 sm:text-base disabled:opacity-60"
            />

            {/* Actions: Clear or Paste button */}
            {url ? (
              <button
                type="button"
                onClick={handleClear}
                disabled={isJobRunning}
                aria-label="Clear input"
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#738079] hover:bg-black/5 hover:text-[#0B0F0D] transition disabled:opacity-40"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePaste}
                aria-label="Paste URL from clipboard"
                className="hidden items-center gap-1.5 rounded-full border border-[rgba(11,15,13,0.08)] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#0B0F0D] shadow-xs transition hover:bg-[#F1F3EE] active:scale-95 sm:flex"
              >
                {isCopied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[3]" />
                    <span className="text-emerald-700">Pasted</span>
                  </>
                ) : (
                  <>
                    <Clipboard className="h-3 w-3 text-[#738079]" />
                    <span>Paste</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Download Trigger Button */}
          <button
            type="submit"
            disabled={isSubmitting || isJobRunning || !url}
            aria-label={isJobRunning ? "Download in progress" : "Start download"}
            className="relative flex h-12 sm:h-auto items-center justify-center gap-2 rounded-2xl bg-[#74da03] px-8 text-sm font-bold text-[#0B0F0D] shadow-[0_4px_16px_rgba(182,255,0,0.4)] transition-all duration-200 hover:bg-[#aef500] hover:shadow-[0_6px_22px_rgba(182,255,0,0.5)] active:scale-[0.98] disabled:opacity-65 disabled:pointer-events-none min-h-[44px]"
          >
            {isSubmitting || isJobRunning ? (
              <Loader2 className="h-5 w-5 animate-spin text-[#0B0F0D]" />
            ) : (
              <>
                <ArrowDown className="h-5 w-5 stroke-[2.8] transition-transform duration-200 group-hover:translate-y-0.5" />
                <span>Download</span>
              </>
            )}
          </button>
        </form>

        {/* Error Alert Banner */}
        {errorMsg && (
          <div 
            role="alert" 
            className="mt-3 flex items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50/80 px-4 py-2.5 text-xs font-semibold text-red-700 animate-in fade-in"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span className="flex-1">{errorMsg}</span>
            <button 
              type="button" 
              onClick={() => setErrorMsg(null)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Real Progress Bar Display */}
        {activeJob && (
          <div 
            aria-live="polite"
            className="mt-3 rounded-2xl border border-[rgba(11,15,13,0.06)] bg-[#F7F8F6]/80 p-3 sm:p-3.5 shadow-xs transition-all"
          >
            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                {activeJob.status === "completed" ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                ) : (
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[#74da03]" />
                )}
                <span className="font-bold text-[#0B0F0D] truncate">
                  {activeJob.progress.phase || (activeJob.status === "completed" ? "Download Ready ✓" : "Processing...")}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono text-xs font-bold text-[#0B0F0D]">
                  {activeJob.progress.percentage}%
                </span>
                {isJobRunning && (
                  <button
                    type="button"
                    onClick={handleCancelJob}
                    className="rounded-lg bg-black/5 px-2 py-1 text-[11px] font-semibold text-[#738079] hover:bg-black/10 hover:text-[#0B0F0D] transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Visual Bar Track */}
            <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-black/5">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-[#74da03] to-[#aef500] transition-all duration-300"
                style={{ width: `${Math.max(activeJob.progress.percentage, 4)}%` }}
              />
            </div>

            {/* Metrics Row (Speed, ETA, Filename) */}
            <div className="mt-2 flex flex-wrap items-center justify-between gap-1 text-[11px] font-medium text-[#738079]">
              <span className="truncate max-w-[240px] sm:max-w-[360px]">
                {activeJob.filename || activeJob.title || "Preparing media stream"}
              </span>
              <div className="flex items-center gap-2">
                {activeJob.progress.speed && <span>{activeJob.progress.speed}</span>}
                {activeJob.progress.eta && <span>ETA {activeJob.progress.eta}</span>}
              </div>
            </div>
          </div>
        )}

        {/* Video Preview Card */}
        {isAnalyzing ? (
          <div className="mt-3 flex items-center gap-3 rounded-2xl border border-[rgba(11,15,13,0.06)] bg-[#F7F8F6]/60 p-3">
            <div className="flex h-16 w-24 shrink-0 animate-pulse items-center justify-center rounded-xl bg-black/5">
              <Loader2 className="h-5 w-5 animate-spin text-[#74da03]" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded-md bg-black/5" />
              <div className="h-3 w-1/3 animate-pulse rounded-md bg-black/5" />
            </div>
          </div>
        ) : mediaInfo && (
          <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-2xl border border-[rgba(11,15,13,0.06)] bg-[#F7F8F6]/80 p-3 shadow-xs transition-all">
            {/* Thumbnail with duration badge */}
            <div className="relative h-20 w-full sm:w-32 shrink-0 overflow-hidden rounded-xl bg-black/5">
              {mediaInfo.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={mediaInfo.thumbnail} 
                  alt={mediaInfo.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-black/5">
                  <Play className="h-6 w-6 text-[#738079]" />
                </div>
              )}
              {mediaInfo.duration ? (
                <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                  {formatDuration(mediaInfo.duration)}
                </span>
              ) : null}
            </div>

            {/* Video Details */}
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
              <h3 className="line-clamp-2 text-xs sm:text-sm font-bold text-[#0B0F0D] leading-snug">
                {mediaInfo.title}
              </h3>
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-[#738079]">
                {mediaInfo.channel && (
                  <span className="flex items-center gap-1">
                    <UserIcon className="h-3 w-3" />
                    {mediaInfo.channel}
                  </span>
                )}
                {mediaInfo.duration ? (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDuration(mediaInfo.duration)}
                  </span>
                ) : null}
                <span className="rounded-md bg-black/5 px-1.5 py-0.5 text-[10px] font-bold text-[#0B0F0D]">
                  {mediaInfo.qualities.length} qualities ready
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Format & Quality Bar */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[rgba(11,15,13,0.06)] px-2 pt-2.5 text-xs text-[#738079]">
          
          {/* Format Tabs */}
          <div className="flex items-center gap-1">
            <span className="mr-1 hidden font-semibold text-[#0B0F0D] sm:inline">Format:</span>
            <button
              type="button"
              disabled={isJobRunning}
              onClick={() => { setMediaType("video"); }}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                mediaType === "video"
                  ? "bg-[#0B0F0D] text-[#74da03]"
                  : "text-[#738079] hover:bg-[#F1F3EE] hover:text-[#0B0F0D]"
              }`}
            >
              Video (MP4)
            </button>
            <button
              type="button"
              disabled={isJobRunning}
              onClick={() => { setMediaType("audio"); }}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                mediaType === "audio"
                  ? "bg-[#0B0F0D] text-[#74da03]"
                  : "text-[#738079] hover:bg-[#F1F3EE] hover:text-[#0B0F0D]"
              }`}
            >
              Audio (MP3)
            </button>
          </div>

          {/* Quality Selector Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#738079]/70 shrink-0" />
            {mediaType === "video" ? (
              <div className="flex flex-wrap items-center gap-1">
                {displayQualities.map((res) => (
                  <button
                    key={res.id}
                    type="button"
                    disabled={isJobRunning}
                    onClick={() => setQuality(res.id)}
                    className={`rounded-md px-2 py-1 text-[11px] font-bold transition whitespace-nowrap ${
                      quality === res.id 
                        ? "bg-[#74da03]/40 text-[#0B0F0D] ring-1 ring-[#0B0F0D]/20" 
                        : "text-[#738079] hover:bg-black/5 hover:text-[#0B0F0D]"
                    }`}
                  >
                    {res.label}
                  </button>
                ))}
              </div>
            ) : (
              <span className="rounded-md bg-[#74da03]/30 px-2.5 py-1 text-[11px] font-bold text-[#0B0F0D]">
                Best Quality (HQ)
              </span>
            )}
          </div>
        </div> 
      </div>  
    </div>
  );
}