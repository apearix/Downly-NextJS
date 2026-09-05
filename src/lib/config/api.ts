/**
 * Helper to dynamically resolve the API Base URL.
 *
 * Architecture:
 * - If NEXT_PUBLIC_API_URL is set in environment (local or cloud), use it.
 * - If running in a browser on a live website (not localhost / 127.0.0.1) and NEXT_PUBLIC_API_URL is empty,
 *   fall back directly to the production Render backend so public visitors can always download media.
 * - In local development without NEXT_PUBLIC_API_URL, returns "" to use local Next.js server & binaries.
 */
export const DEFAULT_PRODUCTION_BACKEND = "https://downly-backend-cek2.onrender.com";

export function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && envUrl.trim() !== "") {
    return envUrl.trim().replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const isLocalhost =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.endsWith(".local");

    if (!isLocalhost) {
      return DEFAULT_PRODUCTION_BACKEND;
    }
  }

  return "";
}
