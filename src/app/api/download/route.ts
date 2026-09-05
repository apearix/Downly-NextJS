import { NextRequest, NextResponse } from "next/server";
import { Readable } from "node:stream";
import {
  downloadYouTubeAudio,
  downloadYouTubeVideo,
} from "@/lib/helpers/youtube";

import { validateMediaUrl } from "@/lib/security/url";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const rate = checkRateLimit(ip);
  if (!rate.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a moment." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();

    const url = body?.url;
    const type = body?.type === "audio" ? "audio" : "video";
    const quality = typeof body?.quality === "string" ? body.quality : undefined;

    const validation = validateMediaUrl(url);
    if (!validation.isValid || !validation.normalizedUrl) {
      return NextResponse.json(
        { error: validation.error || "Please provide a valid YouTube URL." },
        { status: 400 }
      );
    }

    const { stream, filename, size, mimeType } =
      type === "audio"
        ? await downloadYouTubeAudio(url)
        : await downloadYouTubeVideo(url, quality);

    const safeAsciiFilename = filename
      .replace(/[^\x20-\x7E]/g, "_")
      .replace(/["\\]/g, "");
    const encodedFilename = encodeURIComponent(filename);

    const webStream = Readable.toWeb(stream);

    return new NextResponse(webStream as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${safeAsciiFilename}"; filename*=UTF-8''${encodedFilename}`,
        "Content-Length": size.toString(),
        "X-Filename": encodedFilename,
        "Access-Control-Expose-Headers": "Content-Disposition, X-Filename",
      },
    });
  } catch (error) {
    console.error("Download error:", error);

    return NextResponse.json(
      {
        error:
          "Unable to download this media. Please check the URL and try again.",
      },
      { status: 500 }
    );
  }
}