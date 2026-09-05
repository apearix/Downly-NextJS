import { create } from "youtube-dl-exec";
import type { ChildProcess } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { ENV } from "@/lib/config/env";
import { jobStore } from "@/lib/jobs/store";
import { storage } from "@/lib/storage";
import { parseQualityToHeight, getCookiesLocation } from "@/lib/helpers/youtube";
import { sanitizeFilename } from "@/lib/security/url";

const youtubedl = create(ENV.YTDLP_PATH);

class JobQueue {
  private queue: string[] = [];
  private activeJobs = new Set<string>();
  private activeProcesses = new Map<string, ChildProcess>();

  async enqueue(jobId: string): Promise<void> {
    const job = await jobStore.getJob(jobId);
    if (!job) return;

    this.queue.push(jobId);
    await jobStore.updateStatus(jobId, "queued");
    this.processNext();
  }

  async cancel(jobId: string): Promise<boolean> {
    // If queued but not started
    const queueIdx = this.queue.indexOf(jobId);
    if (queueIdx !== -1) {
      this.queue.splice(queueIdx, 1);
      await jobStore.updateStatus(jobId, "cancelled");
      return true;
    }

    // If actively running
    const proc = this.activeProcesses.get(jobId);
    if (proc) {
      try {
        proc.kill("SIGTERM");
      } catch {}
      this.activeProcesses.delete(jobId);
      this.activeJobs.delete(jobId);
      await jobStore.updateStatus(jobId, "cancelled");
      this.processNext();
      return true;
    }

    return false;
  }

  private async processNext(): Promise<void> {
    if (
      this.activeJobs.size >= ENV.MAX_CONCURRENT_JOBS ||
      this.queue.length === 0
    ) {
      return;
    }

    const jobId = this.queue.shift();
    if (!jobId) return;

    this.activeJobs.add(jobId);
    this.runJob(jobId).finally(() => {
      this.activeJobs.delete(jobId);
      this.activeProcesses.delete(jobId);
      this.processNext();
    });
  }

  private async runJob(jobId: string): Promise<void> {
    const job = await jobStore.getJob(jobId);
    if (!job || job.status === "cancelled") return;

    const tempDir = await fs.mkdtemp(
      path.join(os.tmpdir(), `downly-job-${jobId}-`)
    );
    const outputTemplate = path.join(tempDir, "%(title)s.%(ext)s");

    try {
      await jobStore.updateJob(jobId, {
        status: "analyzing",
        progress: { percentage: 0, phase: "Analyzing video streams..." },
      });

      const isAudio = job.type === "audio";
      let flags: Record<string, unknown>;

      if (isAudio) {
        flags = {
          extractAudio: true,
          audioFormat: "mp3",
          audioQuality: 0,
          output: outputTemplate,
          noPlaylist: true,
          preferFreeFormats: true,
          verbose: true,
          ffmpegLocation: ENV.FFMPEG_LOCATION,
          jsRuntimes: "deno,node",
          extractorArgs: "youtube:player_client=android,web",
          cookies: getCookiesLocation() || undefined,
        };
      } else {
        const targetHeight = parseQualityToHeight(job.quality);
        const formatSelector = `bestvideo[height<=?${targetHeight}][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=?${targetHeight}]+bestaudio/best[height<=?${targetHeight}]/best`;
        flags = {
          format: formatSelector,
          mergeOutputFormat: "mp4",
          output: outputTemplate,
          noPlaylist: true,
          verbose: true,
          ffmpegLocation: ENV.FFMPEG_LOCATION,
          jsRuntimes: "deno,node",
          extractorArgs: "youtube:player_client=android,web",
          cookies: getCookiesLocation() || undefined,
        };
      }

      // Execute yt-dlp child process
      const proc = youtubedl.exec(job.url, flags) as unknown as ChildProcess &
        Promise<{ stdout: string; stderr: string }>;
      this.activeProcesses.set(jobId, proc);

      await jobStore.updateJob(jobId, {
        status: "downloading",
        progress: {
          percentage: 0,
          phase: isAudio
            ? "Downloading audio stream..."
            : "Downloading video & audio streams...",
        },
      });

      // Parse progress from stdout
      if (proc.stdout) {
        proc.stdout.on("data", (chunk: Buffer) => {
          const text = chunk.toString();
          this.parseProgressOutput(jobId, text, isAudio);
        });
      }

      await proc;

      // Check if job was cancelled while executing
      const checkJob = await jobStore.getJob(jobId);
      if (checkJob?.status === "cancelled") {
        await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
        return;
      }

      await jobStore.updateJob(jobId, {
        status: "processing",
        progress: {
          percentage: 95,
          phase: isAudio
            ? "Finalizing MP3 conversion..."
            : "Finalizing MP4 packaging...",
        },
      });

      // Find completed file in tempDir
      const files = await fs.readdir(tempDir);
      const targetExt = isAudio ? ".mp3" : ".mp4";
      let matchedFile = files.find((f) =>
        f.toLowerCase().endsWith(targetExt)
      );

      if (!matchedFile && !isAudio) {
        matchedFile = files.find(
          (f) =>
            f.toLowerCase().endsWith(".mkv") ||
            f.toLowerCase().endsWith(".webm")
        );
      }

      if (!matchedFile) {
        throw new Error("Output media file was not generated.");
      }

      const sourceFilePath = path.join(tempDir, matchedFile);
      const cleanName = sanitizeFilename(matchedFile);

      // Save to persistent storage layer
      const { storedPath, size } = await storage.saveCompletedFile(
        sourceFilePath,
        jobId,
        cleanName
      );

      await jobStore.updateJob(jobId, {
        status: "completed",
        progress: {
          percentage: 100,
          phase: "Download ready",
        },
        filename: cleanName,
        filePath: storedPath,
        fileSize: size,
        outputFormat: isAudio ? "mp3" : "mp4",
        title: cleanName.replace(/\.[^/.]+$/, ""),
      });
    } catch (err: unknown) {
      const current = await jobStore.getJob(jobId);
      if (current?.status === "cancelled") return;

      const errorObj = err as { stderr?: string; message?: string };
      console.error(`Error processing job ${jobId}:`, errorObj?.stderr || errorObj?.message || err);

      await jobStore.updateJob(jobId, {
        status: "failed",
        error: "Failed to download and process media. Please try again.",
        progress: {
          percentage: 0,
          phase: "Failed",
        },
      });
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
    }
  }

  private parseProgressOutput(
    jobId: string,
    output: string,
    isAudio: boolean
  ) {
    // Check for merger or audio extraction
    if (output.includes("[Merger]")) {
      jobStore.updateJob(jobId, {
        status: "processing",
        progress: {
          percentage: 90,
          phase: "Merging video and audio with FFmpeg...",
        },
      });
      return;
    }

    if (output.includes("[ExtractAudio]")) {
      jobStore.updateJob(jobId, {
        status: "processing",
        progress: {
          percentage: 90,
          phase: "Converting audio stream to MP3...",
        },
      });
      return;
    }

    // Match yt-dlp download progress:
    // e.g.: [download]  42.5% of ~ 10.50MiB at  2.50MiB/s ETA 00:02
    // e.g.: [download]  15.0% of  50.00MiB at  4.00MiB/s ETA 00:10
    const match = output.match(
      /\[download\]\s+([\d.]+)%\s+of\s+(?:~\s*)?([\d.]+\w+)\s+at\s+([\d.]+\w+\/s)\s+ETA\s+([\d:]+)/i
    );

    if (match) {
      const percent = parseFloat(match[1]);
      const total = match[2];
      const speed = match[3];
      const eta = match[4];

      if (!isNaN(percent)) {
        jobStore.updateProgress(jobId, {
          percentage: Math.min(Math.round(percent), 90),
          speed: total ? `${speed} (${total})` : speed,
          eta,
          phase: isAudio
            ? `Downloading audio (${Math.round(percent)}%)`
            : `Downloading video (${Math.round(percent)}%)`,
        });
      }
    }
  }
}

export const downloadQueue = new JobQueue();
