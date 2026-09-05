import fsSync from "node:fs";
import path from "node:path";
import os from "node:os";

// Windows-specific Winget and standard defaults
const WIN_DEFAULT_FFMPEG_PATH =
  "C:\\Users\\Dharmendra\\AppData\\Local\\Microsoft\\WinGet\\Packages\\yt-dlp.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-N-125875-g5d4d3bdc61-win64-gpl\\bin";
const WIN_DEFAULT_DENO_PATH =
  "C:\\Users\\Dharmendra\\AppData\\Local\\Microsoft\\WinGet\\Packages\\DenoLand.Deno_Microsoft.Winget.Source_8wekyb3d8bbwe";
const WIN_DEFAULT_PYTHON_PATH =
  "C:\\Users\\Dharmendra\\AppData\\Local\\Programs\\Python\\Python313";

const WIN_DEFAULT_YTDLP_PATH = path.join(
  process.cwd(),
  "node_modules",
  "youtube-dl-exec",
  "bin",
  "yt-dlp.exe"
);

// Ensure Windows processes have Deno and Python in PATH
if (process.platform === "win32") {
  const currentPath = process.env.PATH || "";
  const extraPaths = [WIN_DEFAULT_DENO_PATH, WIN_DEFAULT_PYTHON_PATH].filter(
    (p) => !currentPath.includes(p) && fsSync.existsSync(/*turbopackIgnore: true*/ p)
  );
  if (extraPaths.length > 0) {
    process.env.PATH = `${extraPaths.join(";")};${currentPath}`;
  }
}

export const ENV = {
  // Binary Locations
  FFMPEG_LOCATION: (() => {
    if (process.env.FFMPEG_PATH) return process.env.FFMPEG_PATH;
    if (
      process.platform === "win32" &&
      fsSync.existsSync(/*turbopackIgnore: true*/ WIN_DEFAULT_FFMPEG_PATH)
    ) {
      return WIN_DEFAULT_FFMPEG_PATH;
    }
    return undefined;
  })(),

  YTDLP_PATH: (() => {
    if (process.env.YTDLP_PATH) return process.env.YTDLP_PATH;
    if (
      process.platform === "win32" &&
      fsSync.existsSync(/*turbopackIgnore: true*/ WIN_DEFAULT_YTDLP_PATH)
    ) {
      return WIN_DEFAULT_YTDLP_PATH;
    }
    return "yt-dlp";
  })(),

  // Storage
  STORAGE_DIR:
    process.env.STORAGE_DIR || path.join(os.tmpdir(), "downly-storage"),

  // Queue & Concurrency
  MAX_CONCURRENT_JOBS: parseInt(process.env.MAX_CONCURRENT_JOBS || "3", 10),
  JOB_EXPIRY_MS: parseInt(process.env.JOB_EXPIRY_MS || "3600000", 10), // 1 hour

  // Limits
  MAX_VIDEO_DURATION_SECONDS: parseInt(
    process.env.MAX_VIDEO_DURATION_SECONDS || "7200",
    10
  ), // 2 hours
  RATE_LIMIT_WINDOW_MS: parseInt(
    process.env.RATE_LIMIT_WINDOW_MS || "60000",
    10
  ), // 1 minute
  RATE_LIMIT_MAX_REQUESTS: parseInt(
    process.env.RATE_LIMIT_MAX_REQUESTS || "20",
    10
  ), // 20 requests/minute

  // Redis
  REDIS_URL: process.env.REDIS_URL || "",
};
