# Production Dockerfile for Render.com Web Service
# Includes Node.js, Python3, FFmpeg, and yt-dlp

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

# Environment variables
ENV NODE_ENV=production
ENV FFMPEG_PATH=/usr/bin
ENV YTDLP_PATH=/usr/local/bin/yt-dlp
ENV STORAGE_DIR=/tmp/downly-storage
ENV PORT=10000

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and compile
COPY . .
RUN npm run build

# Expose Render web service port
EXPOSE 10000

# Start production server
CMD ["npm", "start", "--", "-p", "10000"]
