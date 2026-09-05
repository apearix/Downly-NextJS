import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Downly - Fast & Free Media Downloader";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px",
          backgroundColor: "#0B0F0D",
          backgroundImage:
            "radial-gradient(circle at 90% 10%, rgba(116, 218, 3, 0.22) 0%, transparent 60%), radial-gradient(circle at 10% 90%, rgba(182, 255, 0, 0.12) 0%, transparent 50%)",
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Header Branding */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                backgroundColor: "#74da03",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0B0F0D",
                fontWeight: 900,
                fontSize: "26px",
              }}
            >
              ↓
            </div>
            <span
              style={{
                fontSize: "36px",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                color: "#ffffff",
              }}
            >
              Downly
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 18px",
              borderRadius: "9999px",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              fontSize: "15px",
              fontWeight: 600,
              color: "#74da03",
            }}
          >
            ● High-Speed Media Pipeline
          </div>
        </div>

        {/* Hero Copy */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: "64px",
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: "-0.04em",
              color: "#ffffff",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            Download media.
            <span style={{ color: "#74da03", marginLeft: "14px" }}>
              Simply. Fast.
            </span>
          </div>

          <div
            style={{
              fontSize: "22px",
              color: "rgba(255, 255, 255, 0.7)",
              maxWidth: "850px",
              lineHeight: 1.4,
            }}
          >
            Universal YouTube Video (1080p & 4K MP4) and Audio (HQ MP3)
            downloader. Zero popup ads, zero software, 100% free and private.
          </div>
        </div>

        {/* Badges / Value Props */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
            paddingTop: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 16px",
              borderRadius: "10px",
              backgroundColor: "rgba(116, 218, 3, 0.15)",
              color: "#74da03",
              fontSize: "15px",
              fontWeight: 700,
            }}
          >
            4K & 1080p MP4
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 16px",
              borderRadius: "10px",
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 600,
            }}
          >
            320kbps MP3 Audio
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 16px",
              borderRadius: "10px",
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 600,
            }}
          >
            Mobile & Desktop Ready
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 16px",
              borderRadius: "10px",
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 600,
            }}
          >
            No Registration
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
