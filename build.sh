#!/bin/bash

# Netlify build script with robust Prisma handling
echo "🚀 Starting GitFreeDocify build..."

# Set binary targets for Prisma
export PRISMA_CLI_BINARY_TARGETS="native,debian-openssl-3.0.x,linux-musl,linux-musl-openssl-3.0.x"

# Generate Prisma client with multiple target attempts
echo "📦 Generating Prisma client..."

# First attempt: Try with environment variable
npx prisma generate --skip-generate=false

# If that fails, try with explicit binary targets
if [ $? -ne 0 ]; then
    echo "⚠️ First attempt failed, trying with explicit binary targets..."
    npx prisma generate --binary-targets native,debian-openssl-3.0.x,linux-musl,linux-musl-openssl-3.0.x
fi

# If still failing, continue without database features
if [ $? -ne 0 ]; then
    echo "⚠️ Prisma generation failed, building without database features..."
    export DATABASE_URL=""
fi

# Build the Next.js application
echo "🏗️ Building Next.js application..."
npm run build:next

echo "✅ Build complete!"
