# Production Dockerfile for Render.com Web Service
# Includes Node.js, Python3, FFmpeg, and yt-dlp

FROM node:22-bookworm-slim

# Install system dependencies: FFmpeg, Python3, unzip, curl, and certificates
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    python3 \
    ca-certificates \
    curl \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install Deno (officially recommended JS runtime for yt-dlp YouTube signature challenges)
RUN curl -fsSL https://github.com/denoland/deno/releases/latest/download/deno-x86_64-unknown-linux-gnu.zip -o /tmp/deno.zip \
    && unzip /tmp/deno.zip -d /usr/local/bin \
    && chmod +x /usr/local/bin/deno \
    && rm /tmp/deno.zip

# Install official yt-dlp_linux PyInstaller binary (bundles yt-dlp-ejs scripts)
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux -o /usr/local/bin/yt-dlp \
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
