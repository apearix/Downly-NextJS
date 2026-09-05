import { NextRequest } from "next/server";
import { jobStore } from "@/lib/jobs/store";
import { downloadQueue } from "@/lib/jobs/queue";
import { toPublicJobDto } from "@/lib/types/job";
import { handleOptions, jsonWithCors } from "@/lib/api/cors";

export const runtime = "nodejs";

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return jsonWithCors(
        { error: "Invalid job identifier." },
        { status: 400 }
      );
    }

    const job = await jobStore.getJob(id);
    if (!job) {
      return jsonWithCors(
        { error: "Job not found or expired." },
        { status: 404 }
      );
    }

    return jsonWithCors(
      {
        success: true,
        job: toPublicJobDto(job),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to retrieve job status:", error);
    return jsonWithCors(
      { error: "Unable to retrieve job status." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return jsonWithCors(
        { error: "Invalid job identifier." },
        { status: 400 }
      );
    }

    const cancelled = await downloadQueue.cancel(id);

    return jsonWithCors(
      {
        success: true,
        message: cancelled
          ? "Download job cancelled."
          : "Job was already completed or not active.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to cancel job:", error);
    return jsonWithCors(
      { error: "Unable to cancel job." },
      { status: 500 }
    );
  }
}
