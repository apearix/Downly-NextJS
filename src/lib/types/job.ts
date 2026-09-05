export type JobStatus =
  | "queued"
  | "analyzing"
  | "downloading"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled"
  | "expired";

export interface JobProgress {
  percentage: number;
  downloadedBytes?: number;
  totalBytes?: number;
  speed?: string;
  eta?: string;
  phase: string;
}

export interface DownloadJob {
  id: string;
  url: string;
  type: "video" | "audio";
  quality: string;
  status: JobStatus;
  progress: JobProgress;
  title?: string;
  thumbnail?: string;
  duration?: number;
  channel?: string;
  filename?: string;
  filePath?: string;
  fileSize?: number;
  outputFormat?: "mp4" | "mp3";
  downloadUrl?: string;
  error?: string;
  createdAt: number;
  updatedAt: number;
  expiresAt: number;
}

export interface CreateJobRequest {
  url: string;
  type?: "video" | "audio";
  quality?: string;
}

export interface JobPublicDto {
  id: string;
  url: string;
  type: "video" | "audio";
  quality: string;
  status: JobStatus;
  progress: JobProgress;
  title?: string;
  thumbnail?: string;
  duration?: number;
  channel?: string;
  filename?: string;
  fileSize?: number;
  outputFormat?: "mp4" | "mp3";
  downloadUrl?: string;
  error?: string;
  createdAt: number;
  updatedAt: number;
  expiresAt: number;
}

export function toPublicJobDto(job: DownloadJob): JobPublicDto {
  return {
    id: job.id,
    url: job.url,
    type: job.type,
    quality: job.quality,
    status: job.status,
    progress: job.progress,
    title: job.title,
    thumbnail: job.thumbnail,
    duration: job.duration,
    channel: job.channel,
    filename: job.filename,
    fileSize: job.fileSize,
    outputFormat: job.outputFormat,
    downloadUrl:
      job.status === "completed" ? `/api/download/${job.id}` : undefined,
    error: job.error,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    expiresAt: job.expiresAt,
  };
}
