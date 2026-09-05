import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { ENV } from "@/lib/config/env";
import { validateMediaUrl } from "@/lib/security/url";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";
import { jobStore } from "@/lib/jobs/store";
import { downloadQueue } from "@/lib/jobs/queue";
import { DownloadJob, toPublicJobDto } from "@/lib/types/job";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const rate = checkRateLimit(ip);
  if (!rate.success) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down and try again." },
      {
        status: 429,
        headers: {
          "Retry-After": "60",
          "X-RateLimit-Limit": rate.limit.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": rate.reset.toString(),
        },
      }
    );
  }

  try {
    const body = await request.json();
    const rawUrl = body?.url;
    const type = body?.type === "audio" ? "audio" : "video";
    const quality = typeof body?.quality === "string" ? body.quality : "1080p";

    const validation = validateMediaUrl(rawUrl);
    if (!validation.isValid || !validation.normalizedUrl) {
      return NextResponse.json(
        { error: validation.error || "Please enter a valid YouTube URL." },
        { status: 400 }
      );
    }

    const jobId = crypto.randomUUID();
    const now = Date.now();

    const job: DownloadJob = {
      id: jobId,
      url: validation.normalizedUrl,
      type,
      quality,
      status: "queued",
      progress: {
        percentage: 0,
        phase: "Queued for processing",
      },
      createdAt: now,
      updatedAt: now,
      expiresAt: now + ENV.JOB_EXPIRY_MS,
    };

    await jobStore.createJob(job);
    // Asynchronously dispatch job execution to the queue
    downloadQueue.enqueue(jobId).catch((err) => {
      console.error(`Failed to enqueue job ${jobId}:`, err);
    });

    return NextResponse.json(
      {
        success: true,
        jobId,
        job: toPublicJobDto(job),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create job:", error);
    return NextResponse.json(
      { error: "Unable to create download job. Please try again." },
      { status: 500 }
    );
  }
}
