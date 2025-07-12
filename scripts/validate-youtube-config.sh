#!/bin/bash

# Script to validate YouTube API configuration
echo "🔍 Validating YouTube API Configuration..."

# Check if environment variables are set
if [ -z "$YOUTUBE_API_KEYS" ] && [ -z "$NEXT_PUBLIC_YOUTUBE_API_KEYS" ]; then
    echo "❌ ERROR: No YouTube API keys found!"
    echo "Please set either YOUTUBE_API_KEYS or NEXT_PUBLIC_YOUTUBE_API_KEYS environment variable"
    exit 1
fi

# Count the number of API keys
if [ ! -z "$YOUTUBE_API_KEYS" ]; then
    KEY_COUNT=$(echo "$YOUTUBE_API_KEYS" | tr ',' '\n' | wc -l)
    echo "✅ Found $KEY_COUNT YouTube API keys in YOUTUBE_API_KEYS"
elif [ ! -z "$NEXT_PUBLIC_YOUTUBE_API_KEYS" ]; then
    KEY_COUNT=$(echo "$NEXT_PUBLIC_YOUTUBE_API_KEYS" | tr ',' '\n' | wc -l)
    echo "⚠️  Found $KEY_COUNT YouTube API keys in NEXT_PUBLIC_YOUTUBE_API_KEYS (consider moving to server-side)"
fi

# Validate key format (basic check)
if [ ! -z "$YOUTUBE_API_KEYS" ]; then
    FIRST_KEY=$(echo "$YOUTUBE_API_KEYS" | cut -d',' -f1)
elif [ ! -z "$NEXT_PUBLIC_YOUTUBE_API_KEYS" ]; then
    FIRST_KEY=$(echo "$NEXT_PUBLIC_YOUTUBE_API_KEYS" | cut -d',' -f1)
fi

if [[ $FIRST_KEY =~ ^AIza[0-9A-Za-z_-]{35}$ ]]; then
    echo "✅ API key format appears valid"
else
    echo "⚠️  API key format may be invalid (should start with 'AIza' and be 39 characters)"
fi

echo "🚀 Configuration check complete!"
