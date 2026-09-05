#!/bin/bash
set -e

echo "=========================================="
echo "       DOWNLY BACKEND STARTING"
echo "=========================================="

echo "yt-dlp version:"
yt-dlp --version || true

echo "Deno version:"
deno --version || true

echo "FFmpeg version:"
ffmpeg -version | head -n 1 || true

echo "=========================================="
echo "Starting bgutil PO Token provider (128MB limit)..."
echo "=========================================="

cd /opt/bgutil-ytdlp-pot-provider/server
node --max-old-space-size=128 build/main.js --port 4416 &
BGUTIL_PID=$!
echo "bgutil PID: $BGUTIL_PID"

echo "Waiting for bgutil..."
for i in {1..30}; do
    if curl -fsS http://127.0.0.1:4416/ping >/dev/null 2>&1; then
        echo "bgutil is READY"
        break
    fi

    if ! kill -0 "$BGUTIL_PID" 2>/dev/null; then
        echo "ERROR: bgutil process stopped unexpectedly"
        exit 1
    fi

    sleep 1
done

if ! curl -fsS http://127.0.0.1:4416/ping >/dev/null 2>&1; then
    echo "ERROR: bgutil failed to start within 30 seconds"
    exit 1
fi

echo "=========================================="
echo "Starting Downly Next.js on port 10000 (220MB limit)..."
echo "=========================================="
cd /app
export NODE_OPTIONS="--max-old-space-size=220"
export DENO_V8_FLAGS="--max-old-space-size=96"
exec npx next start -p 10000
