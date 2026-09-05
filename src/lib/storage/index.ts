import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { ENV } from "@/lib/config/env";
import { sanitizeFilename } from "@/lib/security/url";

export class StorageManager {
  private baseDir: string;

  constructor(baseDir: string = ENV.STORAGE_DIR) {
    this.baseDir = baseDir;
    this.init();
  }

  private async init() {
    try {
      await fs.mkdir(this.baseDir, { recursive: true });
    } catch (err) {
      console.error("Failed to initialize storage directory:", err);
    }
  }

  getFilePath(jobId: string, filename: string): string {
    const safeName = sanitizeFilename(filename);
    return path.join(this.baseDir, `${jobId}_${safeName}`);
  }

  async saveCompletedFile(
    sourcePath: string,
    jobId: string,
    filename: string
  ): Promise<{ storedPath: string; size: number }> {
    await fs.mkdir(this.baseDir, { recursive: true });
    const targetPath = this.getFilePath(jobId, filename);

    // Try rename (atomic move); if cross-device, copy and remove
    try {
      await fs.rename(sourcePath, targetPath);
    } catch {
      await fs.copyFile(sourcePath, targetPath);
      await fs.rm(sourcePath, { force: true }).catch(() => {});
    }

    const stat = await fs.stat(targetPath);
    return { storedPath: targetPath, size: stat.size };
  }

  async getStoredFile(
    jobId: string,
    filename: string
  ): Promise<{
    exists: boolean;
    stream?: fsSync.ReadStream;
    size?: number;
    filePath?: string;
  }> {
    const filePath = this.getFilePath(jobId, filename);
    if (!fsSync.existsSync(filePath)) {
      return { exists: false };
    }

    const stat = await fs.stat(filePath);
    const stream = fsSync.createReadStream(filePath);
    return {
      exists: true,
      stream,
      size: stat.size,
      filePath,
    };
  }

  async deleteJobFiles(jobId: string): Promise<void> {
    try {
      if (!fsSync.existsSync(this.baseDir)) return;
      const files = await fs.readdir(this.baseDir);
      for (const file of files) {
        if (file.startsWith(`${jobId}_`)) {
          await fs.rm(path.join(this.baseDir, file), { force: true }).catch(
            () => {}
          );
        }
      }
    } catch (err) {
      console.warn("Error deleting job files:", err);
    }
  }

  async cleanupExpired(maxAgeMs = ENV.JOB_EXPIRY_MS): Promise<number> {
    try {
      if (!fsSync.existsSync(this.baseDir)) return 0;
      const files = await fs.readdir(this.baseDir);
      const now = Date.now();
      let cleaned = 0;

      for (const file of files) {
        const fullPath = path.join(this.baseDir, file);
        const stat = await fs.stat(fullPath).catch(() => null);
        if (stat && now - stat.mtimeMs > maxAgeMs) {
          await fs.rm(fullPath, { force: true }).catch(() => {});
          cleaned++;
        }
      }
      return cleaned;
    } catch {
      return 0;
    }
  }
}

export const storage = new StorageManager();

// Periodically run cleanup every 15 minutes
setInterval(() => {
  storage.cleanupExpired().catch(() => {});
}, 15 * 60 * 1000).unref?.();
