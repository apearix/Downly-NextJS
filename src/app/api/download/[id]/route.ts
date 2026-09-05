import { NextRequest, NextResponse } from "next/server";
import { Readable } from "node:stream";
import { jobStore } from "@/lib/jobs/store";
import { storage } from "@/lib/storage";
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
        { error: "Invalid download link." },
        { status: 400 }
      );
    }

    const job = await jobStore.getJob(id);
    if (!job || job.status !== "completed" || !job.filename) {
      return jsonWithCors(
        { error: "File is not ready, has expired, or does not exist." },
        { status: 404 }
      );
    }

    const file = await storage.getStoredFile(id, job.filename);
    if (!file.exists || !file.stream || typeof file.size !== "number") {
      return jsonWithCors(
        { error: "Requested file is no longer available." },
        { status: 404 }
      );
    }

    const safeAsciiFilename = job.filename
      .replace(/[^\x20-\x7E]/g, "_")
      .replace(/["\\]/g, "");
    const encodedFilename = encodeURIComponent(job.filename);
    const mimeType =
      job.outputFormat === "mp3" ? "audio/mpeg" : "video/mp4";

    const webStream = Readable.toWeb(file.stream);

    return new NextResponse(webStream as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${safeAsciiFilename}"; filename*=UTF-8''${encodedFilename}`,
        "Content-Length": file.size.toString(),
        "X-Filename": encodedFilename,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Expose-Headers": "Content-Disposition, Content-Length, X-Filename",
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Failed to stream downloaded file:", error);
    return jsonWithCors(
      { error: "Unable to retrieve the requested file." },
      { status: 500 }
    );
  }
}

