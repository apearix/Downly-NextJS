import { jobStore } from "../src/lib/jobs/store";
import { storage } from "../src/lib/storage";
import { ENV } from "../src/lib/config/env";

console.log("=========================================");
console.log("🚀 Downly Production Worker Initialized");
console.log("=========================================");
console.log(`• FFmpeg location: ${ENV.FFMPEG_LOCATION || "system default"}`);
console.log(`• yt-dlp path:     ${ENV.YTDLP_PATH}`);
console.log(`• Storage dir:     ${ENV.STORAGE_DIR}`);
console.log(`• Max concurrency: ${ENV.MAX_CONCURRENT_JOBS}`);
console.log("=========================================");

// Initial cleanup of stale temporary storage
storage.cleanupExpired(ENV.JOB_EXPIRY_MS).then((count) => {
  if (count > 0) {
    console.log(`🧹 Cleaned up ${count} stale files on worker boot.`);
  }
});

// Periodic maintenance
setInterval(async () => {
  const activeJobs = await jobStore.listJobs();
  const running = activeJobs.filter(
    (j) => j.status === "downloading" || j.status === "processing"
  );
  if (running.length > 0) {
    console.log(`[Worker Heartbeat] Active jobs in progress: ${running.length}`);
  }
}, 30000);

// Graceful shutdown handling
const handleShutdown = async (signal: string) => {
  console.log(`\n🛑 Received ${signal}. Shutting down worker gracefully...`);
  process.exit(0);
};

process.on("SIGINT", () => handleShutdown("SIGINT"));
process.on("SIGTERM", () => handleShutdown("SIGTERM"));
