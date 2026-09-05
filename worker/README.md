# Downly Dedicated Media Worker

This directory contains the decoupled worker setup for running `yt-dlp` and `FFmpeg` in production independently of serverless functions.

## Architecture

```
User Browser
    ↓
Next.js / Vercel API
    ↓
POST /api/jobs (Enqueues Job)
    ↓
Downly Worker (Docker container / VPS)
    ↓
yt-dlp + FFmpeg (Merges & encodes media)
    ↓
Temporary / Object Storage
    ↓
GET /api/download/[id]
```

## Docker Deployment

### 1. Build the Docker Image
```bash
docker build -f worker/Dockerfile -t downly-worker .
```

### 2. Run the Container
```bash
docker run -d \
  --name downly-worker \
  --restart unless-stopped \
  -v /var/data/downly-storage:/app/storage \
  -e STORAGE_DIR=/app/storage \
  -e MAX_CONCURRENT_JOBS=5 \
  downly-worker
```

## Deploying to Cloud VPS (Hetzner, DigitalOcean, AWS EC2)
1. Provision an Ubuntu / Debian VPS with at least 2 vCPUs and 4GB RAM.
2. Install Docker.
3. Clone repository and run `docker compose up -d` or run the container as above.
4. Mount the storage volume to persistent disk or configure S3 / Cloudflare R2 object storage.
