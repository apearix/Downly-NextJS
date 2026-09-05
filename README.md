# Downly — Premium Media Downloader

Downly is a modern, fast media downloader web application built with Next.js, Tailwind CSS, yt-dlp, and FFmpeg.

---

## Features

- **YouTube Video Downloader (MP4)**: Supports real source resolutions from 144p to 4K (`144p`, `240p`, `360p`, `480p`, `720p HD`, `1080p FHD`, `1440p 2K`, `2160p 4K`).
- **YouTube Audio Downloader (MP3)**: Extracts and converts audio streams into high-quality MP3 (`48000 Hz, stereo`).
- **Dynamic Format Detection**: Automatically inspects video streams and presents only the resolutions actually available for that specific video.
- **Real-Time Progress Tracking**: Reports actual download percentage, speed (MB/s), ETA, and processing phase (e.g. "Merging video and audio with FFmpeg...").
- **Video Preview Card**: Displays thumbnail, title, channel name, duration badge, and platform tag before downloading.
- **Decoupled Architecture**: Separates frontend/API orchestration from dedicated worker processing.
- **Asynchronous Job Queue**: Features job creation, polling, and cancellation capabilities.
- **Production-Grade Security**: Includes SSRF protection, domain whitelisting, filename sanitization, rate limiting, and temporary file auto-pruning.
- **Mobile & Cross-Platform Optimized**: Tested for Android, iPhone Safari, Chrome, Edge, and Firefox with responsive layout and touch-friendly controls.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **UI & Styling**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Media Engine**: `youtube-dl-exec` + `yt-dlp` + `FFmpeg` / `ffprobe`
- **Architecture**: Modular Job Queue, Storage Manager, and Worker container

---

## Getting Started (Local Development)

### Prerequisites

1. **Node.js**: v20+ (v24 recommended)
2. **Python**: Python 3.10+ installed on Windows / macOS / Linux
3. **FFmpeg & ffprobe**: Installed on your system

### Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env.local`:
   ```env
   # Path to directory containing ffmpeg.exe and ffprobe.exe (Windows example)
   FFMPEG_PATH=C:\Users\Dharmendra\AppData\Local\Microsoft\WinGet\Packages\yt-dlp.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-N-125875-g5d4d3bdc61-win64-gpl\bin
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production Deployment Architecture

For high-traffic production environments, Downly separates API request orchestration from heavy media encoding.

```
Browser
   ↓
Next.js / Vercel API
   ↓
POST /api/jobs (Job creation & rate limiting)
   ↓
Downly Worker (Docker container on VPS / Cloud)
   ↓
yt-dlp + FFmpeg (Stream download & container merge)
   ↓
Storage Layer (Local directory / S3 / R2)
   ↓
GET /api/download/[id] (Secure stream delivery)
```

### Deploying the Standalone Worker (Docker)

Build and run the worker image:
```bash
docker build -f worker/Dockerfile -t downly-worker .
docker run -d \
  --name downly-worker \
  --restart unless-stopped \
  -v /var/data/downly-storage:/app/storage \
  -e STORAGE_DIR=/app/storage \
  -e MAX_CONCURRENT_JOBS=5 \
  downly-worker
```

---

## API Reference

### 1. Metadata Inspection
- **Endpoint**: `GET /api/info?url=<youtube_url>` or `POST /api/info`
- **Response**: `{ success: true, title, thumbnail, duration, channel, qualities: [...] }`

### 2. Create Download Job
- **Endpoint**: `POST /api/jobs`
- **Body**: `{ "url": "https://...", "type": "video" | "audio", "quality": "1080p" }`
- **Response**: `{ success: true, jobId, job: { id, status: "queued", ... } }`

### 3. Check Job Status & Progress
- **Endpoint**: `GET /api/jobs/[id]`
- **Response**: `{ success: true, job: { status, progress: { percentage, speed, eta, phase }, downloadUrl } }`

### 4. Cancel Job
- **Endpoint**: `DELETE /api/jobs/[id]`
- **Response**: `{ success: true, message: "Download job cancelled." }`

### 5. Secure File Download
- **Endpoint**: `GET /api/download/[id]`
- **Response**: Binary stream (`video/mp4` or `audio/mpeg`) with clean `Content-Disposition`.

---

## Environment Variables

| Variable | Description | Default |
| :--- | :--- | :--- |
| `FFMPEG_PATH` | Directory containing `ffmpeg` and `ffprobe` binaries | Winget path on Win32, system default |
| `YTDLP_PATH` | Path to `yt-dlp` executable | Local binary / `yt-dlp` |
| `STORAGE_DIR` | Directory for storing completed downloads | `os.tmpdir()/downly-storage` |
| `MAX_CONCURRENT_JOBS` | Maximum simultaneous worker downloads | `3` |
| `MAX_VIDEO_DURATION_SECONDS` | Maximum allowed video length | `7200` (2 hours) |
| `JOB_EXPIRY_MS` | Lifetime of completed jobs before auto-deletion | `3600000` (1 hour) |
| `RATE_LIMIT_MAX_REQUESTS` | Maximum requests per IP window | `20` |
| `RATE_LIMIT_WINDOW_MS` | Rate limiting window size in milliseconds | `60000` (1 min) |
| `REDIS_URL` | Optional Redis URL for multi-worker synchronization | None (in-memory fallback) |

---

## Security & Fair Use Policy

- Only public media that users have the right or permission to download is supported.
- DRM bypass, authentication bypass, paywall circumvention, and private data extraction are strictly disabled and unsupported.
- Full server-side input validation and SSRF guards protect internal network infrastructure.
