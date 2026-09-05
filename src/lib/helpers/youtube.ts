import { create } from "youtube-dl-exec";
import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import os from "node:os";
import { ENV } from "@/lib/config/env";

const ytDlpPath = ENV.YTDLP_PATH;
const youtubedl = create(ytDlpPath);

function getFfmpegLocation(): string | undefined {
  return ENV.FFMPEG_LOCATION;
}

export function getCookiesLocation(): string | undefined {
  const tmpCookiesPath = path.join(os.tmpdir(), "youtube-cookies.txt");

  // Render Secret File location (/etc/secrets/cookies.txt is read-only).
  // We MUST copy it to writable /tmp so yt-dlp's save_cookies does not crash with:
  // OSError: [Errno 30] Read-only file system
  const renderSecret = "/etc/secrets/cookies.txt";
  if (fsSync.existsSync(/*turbopackIgnore: true*/ renderSecret)) {
    try {
      fsSync.copyFileSync(renderSecret, tmpCookiesPath);
      return tmpCookiesPath;
    } catch (err) {
      console.warn("Failed to copy renderSecret to tmp:", err);
      return renderSecret;
    }
  }

  if (process.env.YOUTUBE_COOKIES) {
    try {
      let content = process.env.YOUTUBE_COOKIES.trim();
      // Handle base64 encoded cookies or literal \n in env strings
      if (content.startsWith("base64:")) {
        content = Buffer.from(content.slice(7), "base64").toString("utf-8");
      } else if (!content.includes("\n") && content.includes("\\n")) {
        content = content.replace(/\\n/g, "\n");
      }
      fsSync.writeFileSync(tmpCookiesPath, content, "utf-8");
      return tmpCookiesPath;
    } catch (err) {
      console.warn("Failed to write YOUTUBE_COOKIES:", err);
    }
  }

  const localCookies = path.join(process.cwd(), "cookies.txt");
  if (fsSync.existsSync(/*turbopackIgnore: true*/ localCookies)) {
    return localCookies;
  }
  return undefined;
}

export const STANDARD_RESOLUTIONS: { height: number; id: string; label: string }[] = [
  { height: 144, id: "144p", label: "144p" },
  { height: 240, id: "240p", label: "240p" },
  { height: 360, id: "360p", label: "360p" },
  { height: 480, id: "480p", label: "480p" },
  { height: 720, id: "720p", label: "720p HD" },
  { height: 1080, id: "1080p", label: "1080p FHD" },
  { height: 1440, id: "1440p", label: "1440p 2K" },
  { height: 2160, id: "2160p", label: "2160p 4K" },
];

export function parseQualityToHeight(quality?: string): number {
  if (!quality) return 1080;
  const match = quality.match(/(\d+)/);
  if (match) {
    const num = parseInt(match[1], 10);
    if (!isNaN(num) && num > 0) return num;
  }
  const qLower = quality.toLowerCase();
  if (qLower.includes("4k")) return 2160;
  if (qLower.includes("2k")) return 1440;
  return 1080;
}

export interface VideoQualityOption {
  id: string;
  label: string;
  height: number;
}

export interface YouTubeMediaInfo {
  title: string;
  thumbnail?: string;
  duration?: number;
  channel?: string;
  qualities: VideoQualityOption[];
}

export interface DownloadResult {
  stream: fsSync.ReadStream;
  filename: string;
  size: number;
  mimeType: string;
}

/**
 * Standard yt-dlp execution options configured for cloud datacenters
 * Uses bgutil PO Token Provider (mweb + BotGuard PO Token on port 4416)
 * Supports cookies when YOUTUBE_COOKIES or /etc/secrets/cookies.txt is set
 */
export function getYtDlpOptions(): Record<string, unknown> {
  const bgutilPort = process.env.BGUTIL_PORT || "4416";
  const cookiesPath = getCookiesLocation();

  const clientList = "android_vr,android,ios,web_embedded,mweb";
  const extractorArgs = `youtube:player_client=${clientList};youtubepot-bgutilhttp:base_url=http://127.0.0.1:${bgutilPort};youtubepot-bgutilscript:disabled=true`;

  return {
    noPlaylist: true,
    jsRuntimes: "deno",
    forceIpv4: true,
    retries: 3,
    fragmentRetries: 3,
    socketTimeout: 30,
    ffmpegLocation: getFfmpegLocation() || undefined,
    cookies: cookiesPath || undefined,
    extractorArgs,
  };
}

/**
 * Fetch video metadata and list of actually available resolutions for YouTube video
 */
export async function getYouTubeInfo(url: string): Promise<YouTubeMediaInfo> {
  try {
    const info = (await youtubedl(url, {
      ...getYtDlpOptions(),
      dumpSingleJson: true,
      skipDownload: true,
      verbose: true,
    } as unknown as Parameters<typeof youtubedl>[1])) as Record<string, unknown>;

    const rawFormats = (Array.isArray(info?.formats) ? info.formats : []) as Record<string, unknown>[];

    // Extract video formats with valid height
    const availableHeights = new Set<number>();
    for (const f of rawFormats) {
      if (
        f.vcodec &&
        f.vcodec !== "none" &&
        typeof f.height === "number" &&
        f.height > 0
      ) {
        availableHeights.add(f.height);
      }
    }

    // Match against standard resolutions
    const heightsArray = Array.from(availableHeights);
    const matchedQualities = STANDARD_RESOLUTIONS.filter((res) =>
      heightsArray.some((h) => Math.abs(h - res.height) <= 12)
    );

    // If no match found 
    const qualities = matchedQualities;

    return {
      title: typeof info.title === "string" ? info.title : "YouTube Media",
      thumbnail: typeof info.thumbnail === "string" ? info.thumbnail : undefined,
      duration: typeof info.duration === "number" ? info.duration : undefined,
      channel:
        typeof info.uploader === "string"
          ? info.uploader
          : typeof info.channel === "string"
          ? info.channel
          : undefined,
      qualities,
    };
  } catch (error: unknown) {
    const err = error as { stderr?: string; message?: string };
    console.error("YT-DLP INFO ERROR:");
    console.error(err?.stderr || err?.message || error);
    throw new Error(err?.stderr || err?.message || "Unable to retrieve information for this YouTube video.");
  }
}

/**
 * Download YouTube audio and convert to MP3
 */
export async function downloadYouTubeAudio(url: string): Promise<DownloadResult> {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "downly-"));
  const outputTemplate = path.join(tempDir, "%(title)s.%(ext)s");

  try {
    console.log("yt-dlp path:", ytDlpPath);

    await youtubedl(url, {
      ...getYtDlpOptions(),
      extractAudio: true,
      audioFormat: "mp3",
      audioQuality: 0,
      output: outputTemplate,
      preferFreeFormats: true,
      verbose: true,
    } as unknown as Parameters<typeof youtubedl>[1]);

    const files = await fs.readdir(tempDir);
    const audioFile = files.find((file) => file.toLowerCase().endsWith(".mp3"));

    if (!audioFile) {
      throw new Error("Audio file was not created.");
    }

    const filePath = path.join(tempDir, audioFile);
    const stat = await fs.stat(filePath);
    const nodeStream = fsSync.createReadStream(filePath);

    let cleaned = false;
    const cleanup = async () => {
      if (cleaned) return;
      cleaned = true;
      await fs.rm(tempDir, { recursive: true, force: true }).catch((err) => {
        console.warn("Failed to clean up audio tempDir:", err?.message);
      });
    };

    nodeStream.on("close", cleanup);
    nodeStream.on("error", cleanup);

    return {
      stream: nodeStream,
      filename: audioFile,
      size: stat.size,
      mimeType: "audio/mpeg",
    };
  } catch (error: unknown) {
    const err = error as { stderr?: string; message?: string };
    console.error("YT-DLP AUDIO ERROR:");
    console.error(err?.stderr || err?.message || error);
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
    throw error;
  }
}

/**
 * Download YouTube video at specified quality and merge into MP4 with FFmpeg
 */
export async function downloadYouTubeVideo(
  url: string,
  quality?: string
): Promise<DownloadResult> {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "downly-video-"));
  const outputTemplate = path.join(tempDir, "%(title)s.%(ext)s");
  const targetHeight = parseQualityToHeight(quality);

  // Best MP4 video + M4A audio first for fast stream-copy mux,
  // falling back to any video + audio merged to MP4
  const formatSelector = `bestvideo[height<=?${targetHeight}][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=?${targetHeight}]+bestaudio/best[height<=?${targetHeight}]/best`;

  try {
    console.log("yt-dlp path:", ytDlpPath);
    console.log("target resolution height:", targetHeight);

    await youtubedl(url, {
      ...getYtDlpOptions(),
      format: formatSelector,
      mergeOutputFormat: "mp4",
      output: outputTemplate,
      verbose: true,
    } as unknown as Parameters<typeof youtubedl>[1]);

    const files = await fs.readdir(tempDir);
    const videoFile =
      files.find((file) => file.toLowerCase().endsWith(".mp4")) ||
      files.find(
        (file) =>
          file.toLowerCase().endsWith(".mkv") ||
          file.toLowerCase().endsWith(".webm")
      );

    if (!videoFile) {
      throw new Error("Video file was not created.");
    }

    const filePath = path.join(tempDir, videoFile);
    const stat = await fs.stat(filePath);
    const nodeStream = fsSync.createReadStream(filePath);

    let cleaned = false;
    const cleanup = async () => {
      if (cleaned) return;
      cleaned = true;
      await fs.rm(tempDir, { recursive: true, force: true }).catch((err) => {
        console.warn("Failed to clean up video tempDir:", err?.message);
      });
    };

    nodeStream.on("close", cleanup);
    nodeStream.on("error", cleanup);

    return {
      stream: nodeStream,
      filename: videoFile,
      size: stat.size,
      mimeType: "video/mp4",
    };
  } catch (error: unknown) {
    const err = error as { stderr?: string; message?: string };
    console.error("YT-DLP VIDEO ERROR:");
    console.error(err?.stderr || err?.message || error);
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
    throw error;
  }
}