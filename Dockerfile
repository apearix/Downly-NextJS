# =========================================================
# Downly Production Dockerfile for Render Web Service
# Next.js 16 + yt-dlp + FFmpeg + Deno + bgutil PO Token Provider
# =========================================================

FROM node:22-bookworm-slim

# System dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    python3 \
    ca-certificates \
    curl \
    unzip \
    git \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Deno (for yt-dlp YouTube signature challenges)
RUN curl -fsSL https://github.com/denoland/deno/releases/latest/download/deno-x86_64-unknown-linux-gnu.zip -o /tmp/deno.zip \
    && unzip /tmp/deno.zip -d /usr/local/bin \
    && chmod +x /usr/local/bin/deno \
    && rm -f /tmp/deno.zip

# Install yt-dlp Linux PyInstaller binary
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux -o /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp

# Clone and build bgutil PO Token Provider (v1.3.2)
WORKDIR /opt
RUN git clone --depth 1 --branch 1.3.2 https://github.com/Brainicism/bgutil-ytdlp-pot-provider.git bgutil-ytdlp-pot-provider

WORKDIR /opt/bgutil-ytdlp-pot-provider/server
RUN npm ci && npx tsc

# Install only the fast HTTP provider plugin (remove slow script provider that causes timeouts)
RUN mkdir -p /root/yt-dlp-plugins/bgutil-ytdlp-pot-provider \
    && cp -r /opt/bgutil-ytdlp-pot-provider/plugin/* /root/yt-dlp-plugins/bgutil-ytdlp-pot-provider/ \
    && mkdir -p /etc/yt-dlp/plugins/bgutil-ytdlp-pot-provider \
    && cp -r /opt/bgutil-ytdlp-pot-provider/plugin/* /etc/yt-dlp/plugins/bgutil-ytdlp-pot-provider/ \
    && find /root/yt-dlp-plugins /etc/yt-dlp/plugins -name "*script*.py" -delete

# Configure plugin directories for yt-dlp
RUN mkdir -p /root/.config/yt-dlp \
    && printf '%s\n' '--plugin-dirs' '/root/yt-dlp-plugins' > /root/.config/yt-dlp/config \
    && mkdir -p /etc/yt-dlp \
    && printf '%s\n' '--plugin-dirs' '/etc/yt-dlp/plugins' > /etc/yt-dlp/config

# Downly Next.js Application
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=10000
ENV BGUTIL_PORT=4416
ENV FFMPEG_PATH=/usr/bin
ENV FFMPEG_LOCATION=/usr/bin
ENV YTDLP_PATH=/usr/local/bin/yt-dlp
ENV STORAGE_DIR=/tmp/downly-storage

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build Next.js
COPY . .
RUN npm run build

# Entrypoint script to start bgutil PO Token provider and Next.js
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 10000

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
