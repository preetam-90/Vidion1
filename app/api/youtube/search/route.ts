import { searchVideos, YouTubeVideo } from "@/lib/youtube-api";
import { NextResponse } from "next/server";

export const runtime = "edge";

// Fallback video for emergency cases
const fallbackVideo = {
  id: "fallback-search-1",
  snippet: {
    title: "Search Result",
    description: "Search result for Indian news",
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
    const query = searchParams.get("q");
    const maxResults = parseInt(searchParams.get("maxResults") || "24", 10);
    const regionCode = searchParams.get("regionCode") || "IN"; // Default to India
    const pageToken = searchParams.get("pageToken") || undefined;

    if (!query) {
      return NextResponse.json(
        { 
          error: "Search query is required",
          items: [fallbackVideo],
          nextPageToken: null
        },
        { status: 400 }
      );
    }

    console.log(`[SEARCH_API] Searching for "${query}" in region ${regionCode}, max results: ${maxResults}, page token: ${pageToken || 'initial'}`);

    // Append "news" to the query if it doesn't already contain it
    const searchQuery = query.toLowerCase().includes("news") ? query : `${query} news`;
    
    try {
      const response = await searchVideos(searchQuery, maxResults, pageToken);
      
      if (!response || !response.items) {
        console.error("[SEARCH_API] Invalid response from searchVideos");
        throw new Error("Failed to search videos");
      }

      console.log(`[SEARCH_API] Received ${response.items.length} videos from API, nextPageToken: ${response.nextPageToken || 'none'}`);

      const filteredVideos = response.items.filter(video => {
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
          
          // Some videos might not have width/height in thumbnails
          // So we'll be more lenient here
          const isLandscape = !thumbnail.width || !thumbnail.height || thumbnail.width > thumbnail.height;

          return isLongEnough && isLandscape;
        } catch (err) {
          console.warn("[SEARCH_API] Error filtering video:", err);
          return false;
        }
      });

      console.log(`[SEARCH_API] After filtering, ${filteredVideos.length} videos remain.`);

      // If we got no videos at all (empty response), use fallback
      if (response.items.length === 0) {
        console.warn("[SEARCH_API] No videos found for search, using fallback");
        return NextResponse.json({
          items: [fallbackVideo],
          nextPageToken: null
        });
      }
      
      // Fallback: If filtering removes all videos, return the original list to avoid a blank page.
      if (response.items.length > 0 && filteredVideos.length === 0) {
        console.warn(
          "[SEARCH_API] Filtering removed all videos. Returning original unfiltered list as a fallback."
        );
        return NextResponse.json({ 
          items: response.items,
          nextPageToken: response.nextPageToken
        });
      }

      return NextResponse.json({
        items: filteredVideos,
        nextPageToken: response.nextPageToken
      });
    } catch (error) {
      console.error("[SEARCH_API] Error searching videos:", error);
      return NextResponse.json({
        items: [fallbackVideo],
        nextPageToken: null,
        error: `Search failed: ${error}`
      });
    }
  } catch (error) {
    console.error("Error in search videos API:", error);
    return NextResponse.json({
      items: [fallbackVideo],
      nextPageToken: null,
      error: "Failed to search videos"
    }, { status: 200 }); // Use 200 status with error in body
  }
}