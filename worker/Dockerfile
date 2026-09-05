# Production Downloader Worker Container
# Decoupled worker image for yt-dlp + FFmpeg media processing

FROM node:20-bookworm-slim

# Install system dependencies: FFmpeg, Python3, and curl for yt-dlp
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    python3 \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install latest yt-dlp binary
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp

WORKDIR /app

# Configure environment variables
ENV NODE_ENV=production
ENV FFMPEG_PATH=/usr/bin
ENV YTDLP_PATH=/usr/local/bin/yt-dlp
ENV STORAGE_DIR=/app/storage
ENV MAX_CONCURRENT_JOBS=5

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application files
COPY . .

# Expose storage volume
VOLUME ["/app/storage"]

# Start dedicated worker process
CMD ["node", "-r", "ts-node/register", "worker/worker.ts"]
