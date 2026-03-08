#!/usr/bin/env bash

# Create persistent cache directory (Render preserves /opt/render/project/.cache)
export PUPPETEER_CACHE_DIR="/opt/render/project/.cache/puppeteer"
mkdir -p "$PUPPETEER_CACHE_DIR"

# Install dependencies normally
npm install

# Explicitly install browser (chrome) into the cache dir
npx puppeteer browsers install chrome

# Optional: if you still have issues, you can add more flags or logging here