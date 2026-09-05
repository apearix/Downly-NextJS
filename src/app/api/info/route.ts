import { NextRequest, NextResponse } from "next/server";
import { getYouTubeInfo } from "@/lib/helpers/youtube";
import { validateMediaUrl } from "@/lib/security/url";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const rate = checkRateLimit(ip);
  if (!rate.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a moment." },
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
    const { searchParams } = new URL(request.url);
    const rawUrl = searchParams.get("url") || "";

    const validation = validateMediaUrl(rawUrl);
    if (!validation.isValid || !validation.normalizedUrl) {
      return NextResponse.json(
        { error: validation.error || "Please provide a valid YouTube URL." },
        { status: 400 }
      );
    }

    const info = await getYouTubeInfo(validation.normalizedUrl);
    return NextResponse.json({ success: true, ...info }, { status: 200 });
  } catch (error) {
    console.error("Info route error:", error);
    return NextResponse.json(
      { error: "Unable to retrieve information for this YouTube video." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const rate = checkRateLimit(ip);
  if (!rate.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a moment." },
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
    const rawUrl = body?.url || "";

    const validation = validateMediaUrl(rawUrl);
    if (!validation.isValid || !validation.normalizedUrl) {
      return NextResponse.json(
        { error: validation.error || "Please provide a valid YouTube URL." },
        { status: 400 }
      );
    }

    const info = await getYouTubeInfo(validation.normalizedUrl);
    return NextResponse.json({ success: true, ...info }, { status: 200 });
  } catch (error) {
    console.error("Info route error:", error);
    return NextResponse.json(
      { error: "Unable to retrieve information for this YouTube video." },
      { status: 500 }
    );
  }
}
