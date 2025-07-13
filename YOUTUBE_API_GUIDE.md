# YouTube API Integration Guide

This document provides information about the YouTube API integration in this project and how to manage API keys.

## API Key Management

The application uses YouTube Data API v3 for fetching video data. Due to YouTube's quota limitations (10,000 units per day per API key), we use a rotating key strategy to maximize available quota.

### Setting Up API Keys

1. Create one or more YouTube Data API v3 keys in the [Google Cloud Console](https://console.cloud.google.com/)
2. Add your keys to the `.env.local` file in the following format:
   ```
   NEXT_PUBLIC_YOUTUBE_API_KEYS=key1,key2,key3
   ```

### Checking API Keys

We've included a utility script to check the validity of your API keys:

```bash
node check-api-keys.js
```

This will test each key and report which ones are valid, invalid, or have exceeded their quota.

### Cleaning API Keys

If you have many keys and want to remove invalid or quota-exceeded keys, use:

```bash
node clean-api-keys.js
```

This script will:
1. Check all keys in your `.env.local` file
2. Create a backup of your current `.env.local` file as `.env.local.bak`
3. Update `.env.local` to only include valid keys

## Error Handling

The application is designed to handle YouTube API errors gracefully:

1. If no API keys are configured, it will fall back to local data
2. If all API keys have exceeded their quota, it will display appropriate messages and use fallback data
3. If the API returns errors, the UI will continue to function with available data

## Troubleshooting

### "Failed to fetch videos" errors

This usually indicates one of the following:

1. **API Key Issues**: All API keys have exceeded their quota or are invalid
   - Solution: Add more API keys or wait until quota resets (usually 24 hours)
   - Check key status with `node check-api-keys.js`

2. **Network Issues**: The application cannot reach YouTube API servers
   - Solution: Check your internet connection and firewall settings

3. **API Changes**: YouTube API has changed, requiring code updates
   - Solution: Check for updates to the application or report the issue

### Quota Management Tips

1. Each search request costs 100 units
2. Each video details request costs 1 unit per video
3. To maximize quota efficiency:
   - Reduce the number of API calls by increasing cache duration
   - Use multiple API keys and rotate between them
   - Implement proper error handling to avoid wasting quota on failed requests

## Additional Resources

- [YouTube Data API Documentation](https://developers.google.com/youtube/v3/docs)
- [Quota Calculator](https://developers.google.com/youtube/v3/determine_quota_cost)