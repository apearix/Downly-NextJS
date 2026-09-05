import { DownloadJob, JobStatus, JobProgress } from "@/lib/types/job";

export interface JobStore {
  createJob(job: DownloadJob): Promise<DownloadJob>;
  getJob(id: string): Promise<DownloadJob | null>;
  updateJob(
    id: string,
    updates: Partial<DownloadJob>
  ): Promise<DownloadJob | null>;
  updateProgress(id: string, progress: JobProgress): Promise<void>;
  updateStatus(id: string, status: JobStatus, error?: string): Promise<void>;
  deleteJob(id: string): Promise<boolean>;
  listJobs(): Promise<DownloadJob[]>;
}

class MemoryJobStore implements JobStore {
  private jobs = new Map<string, DownloadJob>();

  constructor() {
    // Prune expired jobs every 5 minutes
    setInterval(() => {
      this.cleanupExpired();
    }, 5 * 60 * 1000).unref?.();
  }

  async createJob(job: DownloadJob): Promise<DownloadJob> {
    this.jobs.set(job.id, job);
    return job;
  }

  async getJob(id: string): Promise<DownloadJob | null> {
    const job = this.jobs.get(id);
    if (!job) return null;

    if (Date.now() > job.expiresAt && job.status !== "completed") {
      job.status = "expired";
    }
    return job;
  }

  async updateJob(
    id: string,
    updates: Partial<DownloadJob>
  ): Promise<DownloadJob | null> {
    const existing = this.jobs.get(id);
    if (!existing) return null;

    const updated: DownloadJob = {
      ...existing,
      ...updates,
      updatedAt: Date.now(),
    };
    this.jobs.set(id, updated);
    return updated;
  }

  async updateProgress(id: string, progress: JobProgress): Promise<void> {
    const existing = this.jobs.get(id);
    if (!existing) return;
    existing.progress = progress;
    existing.updatedAt = Date.now();
  }

  async updateStatus(
    id: string,
    status: JobStatus,
    error?: string
  ): Promise<void> {
    const existing = this.jobs.get(id);
    if (!existing) return;
    existing.status = status;
    if (error) existing.error = error;
    existing.updatedAt = Date.now();
  }

  async deleteJob(id: string): Promise<boolean> {
    return this.jobs.delete(id);
  }

  async listJobs(): Promise<DownloadJob[]> {
    return Array.from(this.jobs.values());
  }

  private cleanupExpired() {
    const now = Date.now();
    for (const [id, job] of this.jobs.entries()) {
      if (now > job.expiresAt) {
        this.jobs.delete(id);
      }
    }
  }
}

export const jobStore = new MemoryJobStore();
