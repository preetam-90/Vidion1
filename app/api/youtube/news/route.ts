import { searchVideos, searchVideosByCategory, YouTubeVideo } from "@/lib/youtube-api";
import { NextResponse } from "next/server";

export const runtime = "edge";

// Fallback video for emergency cases
const fallbackVideo = {
  id: "fallback-news-1",
  snippet: {
    title: "Latest News Update",
    description: "Breaking news coverage from India",
    publishedAt: new Date().toISOString(),
    channelTitle: "News Channel",
    thumbnails: {
      high: { url: '/images/placeholder-poster.jpg', width: 480, height: 360 },
      medium: { url: '/images/placeholder-poster.jpg', width: 320, height: 180 },
      default: { url: '/images/placeholder-poster.jpg', width: 120, height: 90 }
    },
    channelId: "fallback-channel"
  },
  statistics: { viewCount: "1000", likeCount: "100", commentCount: "10" },
  contentDetails: { duration: "PT10M" }
};

// Helper function to convert ISO 8601 duration to seconds
function convertDurationToSeconds(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  return hours * 3600 + minutes * 60 + seconds;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const maxResults = parseInt(searchParams.get("maxResults") || "24", 10);
    const regionCode = searchParams.get("regionCode") || "IN"; // Default to India
    const pageToken = searchParams.get("pageToken") || undefined;
    const queryIndex = parseInt(searchParams.get("queryIndex") || "0", 10);

    console.log(`[NEWS_API] Fetching news videos for region ${regionCode}, max results: ${maxResults}, page token: ${pageToken || 'initial'}, query index: ${queryIndex}`);

    // List of news channel queries to rotate through for more variety
    const searchQueries = [
      "NDTV India news",
      "Aaj Tak news",
      "India Today news",
      "Republic TV news",
      "ABP News",
      "Times Now",
      "India TV news",
      "News18 India",
      "DD News"
    ];

    // Pick a query based on queryIndex
    const currentQuery = searchQueries[queryIndex % searchQueries.length];

    // Try to get videos by both methods and combine the results
    let videos: YouTubeVideo[] = [];
    let nextPageToken: string | null = null;
    let nextQueryIndex = queryIndex;
    let apiErrors = [];

    // Always try both methods to maximize our chances of getting videos
    // Method 1: Try category search first
    try {
      console.log(`[NEWS_API] Trying category search with page token: ${pageToken || 'none'}`);
      const categoryResponse = await searchVideosByCategory(
        "25", // News & Politics category ID
        maxResults,
        regionCode,
        pageToken
      ) as any; // Using any because we need to access nextPageToken

      if (categoryResponse && Array.isArray(categoryResponse.items)) {
        // Safely add videos with type assertion
        videos = [...videos, ...(categoryResponse.items as YouTubeVideo[])];
        nextPageToken = categoryResponse.nextPageToken || null;
      } else if (categoryResponse && Array.isArray(categoryResponse)) {
        // Handle legacy response format
        videos = [...videos, ...(categoryResponse as YouTubeVideo[])];
      }
      console.log(`[NEWS_API] Category search returned ${videos.length} videos, nextPageToken: ${nextPageToken || 'none'}`);
    } catch (error) {
      console.warn("[NEWS_API] Category search failed:", error);
      apiErrors.push(`Category search error: ${error}`);
    }

    // Method 2: Also try direct search
    if (!pageToken || videos.length < maxResults / 2) {
      try {
        console.log(`[NEWS_API] Trying direct search with query: "${currentQuery}"`);

        // Only use pageToken with direct search if category search failed
        const directPageToken = videos.length === 0 ? pageToken : undefined;

        const searchResponse = await searchVideos(currentQuery, maxResults, directPageToken) as any;

        if (searchResponse && Array.isArray(searchResponse.items)) {
          // New response format with nextPageToken
          videos = [...videos, ...(searchResponse.items as YouTubeVideo[])];
          // Only use nextPageToken from direct search if we don't already have one from category search
          if (!nextPageToken) {
            nextPageToken = searchResponse.nextPageToken || null;
          }
        } else if (searchResponse && Array.isArray(searchResponse)) {
          // Legacy response format
          videos = [...videos, ...(searchResponse as YouTubeVideo[])];
        }

        console.log(`[NEWS_API] Direct search returned ${videos.length - (videos.length === 0 ? 0 : maxResults / 2)} videos`);
      } catch (error) {
        console.warn("[NEWS_API] Direct search failed:", error);
        apiErrors.push(`Direct search error: ${error}`);
      }
    }

    // If we don't have a next page token but have more queries, move to next query
    if (!nextPageToken && videos.length > 0) {
      nextQueryIndex = queryIndex + 1;
      console.log(`[NEWS_API] No more pages for current query, moving to query index ${nextQueryIndex}`);
    }

    // If we still have no videos, provide fallback
    if (videos.length === 0) {
      if (apiErrors.length > 0) {
        console.error("[NEWS_API] All API methods failed:", apiErrors);
      }
      console.warn("[NEWS_API] No videos found, using fallback data");
      videos = [fallbackVideo as any];
      // Move to next query for next attempt
      nextQueryIndex = queryIndex + 1;
    }

    console.log(`[NEWS_API] Total: ${videos.length} videos from API before filtering.`);

    // Remove duplicates based on video ID
    const uniqueVideos = Array.from(new Map(videos.map(video => [video.id, video])).values());
    console.log(`[NEWS_API] After removing duplicates: ${uniqueVideos.length} videos`);

    const filteredVideos = uniqueVideos.filter(video => {
      try {
        if (!video || !video.contentDetails || !video.snippet) {
          return false;
        }

        const duration = video.contentDetails.duration;
        if (!duration) {
          return false;
        }
        const durationInSeconds = convertDurationToSeconds(duration);

        // Filter for medium to long videos (at least 1 minute)
        const isLongEnough = durationInSeconds >= 60;

        const thumbnail = video.snippet.thumbnails?.high;
        if (!thumbnail) {
          return false;
        }

        // Be more flexible with thumbnails
        const isLandscape = !thumbnail.width || !thumbnail.height || thumbnail.width > thumbnail.height;

        return isLongEnough && isLandscape;
      } catch (err) {
        console.warn("[NEWS_API] Error filtering video:", err);
        return false;
      }
    });

    console.log(`[NEWS_API] After filtering, ${filteredVideos.length} videos remain.`);

    // Fallback: If filtering removes all videos, return the original list to avoid a blank page.
    if (uniqueVideos.length > 0 && filteredVideos.length === 0) {
      console.warn(
        "[NEWS_API] Filtering removed all videos. Returning original unfiltered list as a fallback."
      );
      return NextResponse.json({
        items: uniqueVideos,
        nextPageToken,
        nextQueryIndex
      });
    }

    return NextResponse.json({
      items: filteredVideos,
      nextPageToken,
      nextQueryIndex
    });
  } catch (error) {
    console.error("Error in news videos API:", error);
    return NextResponse.json({
      items: [fallbackVideo],
      nextPageToken: null,
      nextQueryIndex: 0,
      error: "Failed to fetch news videos"
    }, { status: 200 }); // Use 200 status with error in body to allow client to handle it
  }
}