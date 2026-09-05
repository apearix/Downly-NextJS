const ALLOWED_YOUTUBE_DOMAINS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtu.be",
]);

const BLOCKED_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "169.254.169.254", // Cloud metadata IP
]);

export function validateMediaUrl(rawUrl: string): {
  isValid: boolean;
  normalizedUrl?: string;
  error?: string;
} {
  if (!rawUrl || typeof rawUrl !== "string") {
    return { isValid: false, error: "Please enter a valid URL." };
  }

  const trimmed = rawUrl.trim();
  if (trimmed.length > 2048) {
    return { isValid: false, error: "URL is too long." };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { isValid: false, error: "Malformed or invalid URL format." };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return {
      isValid: false,
      error: "Only HTTP and HTTPS protocols are supported.",
    };
  }

  const hostname = parsed.hostname.toLowerCase();

  // SSRF guard
  if (
    BLOCKED_HOSTS.has(hostname) ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.") ||
    hostname.startsWith("172.16.") ||
    hostname.endsWith(".internal") ||
    hostname.endsWith(".local")
  ) {
    return { isValid: false, error: "Invalid target host." };
  }

  // Domain verification
  const isYouTube =
    ALLOWED_YOUTUBE_DOMAINS.has(hostname) ||
    hostname.endsWith(".youtube.com");

  if (!isYouTube) {
    return {
      isValid: false,
      error: "Currently, only YouTube URLs are supported.",
    };
  }

  return { isValid: true, normalizedUrl: parsed.toString() };
}

export function sanitizeFilename(raw: string, fallback = "downly-media"): string {
  if (!raw || typeof raw !== "string") return fallback;

  let clean = raw
    // Remove control characters and path traversal
    .replace(/[\x00-\x1f\x7f]/g, "")
    .replace(/[/\\]/g, "_")
    .replace(/\.\.+/g, ".")
    // Remove Windows reserved characters
    .replace(/[<>:"|?*]/g, "")
    .trim();

  if (!clean) return fallback;

  // Truncate to reasonable length while preserving extension
  if (clean.length > 180) {
    const lastDot = clean.lastIndexOf(".");
    if (lastDot > 0 && lastDot > clean.length - 10) {
      const ext = clean.substring(lastDot);
      clean = clean.substring(0, 180 - ext.length) + ext;
    } else {
      clean = clean.substring(0, 180);
    }
  }

  return clean;
}
