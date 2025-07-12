#!/bin/bash

# Vercel Environment Variable Setup Script
echo "🚀 Setting up Vercel Environment Variables..."

# Extract the YouTube API keys from .env.local
YOUTUBE_KEYS=$(grep "^YOUTUBE_API_KEYS=" .env.local | cut -d'=' -f2)

if [ -z "$YOUTUBE_KEYS" ]; then
    echo "❌ ERROR: Could not find YOUTUBE_API_KEYS in .env.local"
    exit 1
fi

echo "✅ Found YouTube API keys"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Vercel CLI not found. Please install it first:"
    echo "npm i -g vercel"
    echo ""
    echo "🔧 Manual setup instructions:"
    echo "1. Go to your Vercel dashboard: https://vercel.com/dashboard"
    echo "2. Select your project"
    echo "3. Go to Settings → Environment Variables"
    echo "4. Add this variable for Production, Preview, and Development:"
    echo ""
    echo "Variable Name: YOUTUBE_API_KEYS"
    echo "Value: $YOUTUBE_KEYS"
    echo ""
    echo "5. Remove NEXT_PUBLIC_YOUTUBE_API_KEYS if it exists"
    echo "6. Redeploy your application"
    exit 0
fi

echo "🔧 Setting up environment variables with Vercel CLI..."

# Set environment variables for all environments
echo "Setting YOUTUBE_API_KEYS for production..."
vercel env add YOUTUBE_API_KEYS production <<< "$YOUTUBE_KEYS"

echo "Setting YOUTUBE_API_KEYS for preview..."
vercel env add YOUTUBE_API_KEYS preview <<< "$YOUTUBE_KEYS"

echo "Setting YOUTUBE_API_KEYS for development..."
vercel env add YOUTUBE_API_KEYS development <<< "$YOUTUBE_KEYS"

echo "✅ Environment variables set successfully!"
echo ""
echo "🚀 Now deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo ""
echo "🧪 Test your deployment:"
echo "- Check YouTube thumbnails load properly"
echo "- Test /api/youtube/home endpoint"
echo "- Test /api/youtube/status endpoint"
echo "- Test search functionality"
