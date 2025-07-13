import { getTrendingVideos } from "@/lib/youtube-api"
import { NextResponse } from "next/server"

export const runtime = 'edge'

// Helper function to safely extract values
function safeExtract(obj: any, path: string[], defaultValue: any = undefined) {
  try {
    let current = obj;
    for (const key of path) {
      if (current === undefined || current === null) return defaultValue;
      current = current[key];
    }
    return current !== undefined && current !== null ? current : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

export async function GET(request: Request) {
  try {
    console.log("Trending API route called");
    
    const { searchParams } = new URL(request.url)
    const pageToken = searchParams.get('pageToken')
    const regionCode = searchParams.get('region') || "IN" // Default to India
    const videoCategoryId = searchParams.get('videoCategoryId')
    // Set default maxResults to 12 videos per batch
    const maxResults = parseInt(searchParams.get('maxResults') || '12', 10)

    console.log(`Trending API: Fetching trending videos for region ${regionCode}${videoCategoryId ? `, category ${videoCategoryId}` : ''}, pageToken: ${pageToken || 'initial'}`);

    const response = await getTrendingVideos(regionCode, maxResults, pageToken || undefined, videoCategoryId || undefined)
    
    if (!response || !response.items) {
      console.error("Trending API: No response or items from getTrendingVideos");
      throw new Error('Failed to fetch trending videos')
    }

    console.log(`Trending API: Raw response has ${response.items.length} items and nextPageToken: ${response.nextPageToken || 'none'}`);

    const items = response.items
      .filter((video: any) => video && typeof video === 'object') // Filter out null/undefined items
      .map((video: any) => {
        try {
          const highThumbnail = safeExtract(video, ['snippet', 'thumbnails', 'high'], null)
          if (!highThumbnail) {
            console.log(`Filtering out video with no high-res thumbnail: ${video.id}`)
            return null
          }

          // More lenient landscape check: allow any thumbnail where width >= height.
          // Some YouTube API responses have width/height only on certain resolutions.
          let isLandscape = true
          if (highThumbnail.width && highThumbnail.height) {
            isLandscape = highThumbnail.width >= highThumbnail.height // portrait if height greater than width
          }

          if (!isLandscape) {
            console.log(`Filtering out portrait video: ${video.id}`)
            return null
          }

          // Check duration to filter out shorts
          const duration = safeExtract(video, ['contentDetails', 'duration'], 'PT0S')
          const durationSeconds = convertDurationToSeconds(duration)

          // Filter out videos under 60 seconds
          if (durationSeconds < 60) {
            console.log(`Filtering out short video: ${video.id}`)
            return null
          }
          
          return {
            id: safeExtract(video, ['id'], `fallback-${Math.random().toString(36).substring(2, 9)}`),
            snippet: safeExtract(video, ['snippet'], {}),
            statistics: safeExtract(video, ['statistics'], {}),
            contentDetails: safeExtract(video, ['contentDetails'], {}),
            title: safeExtract(video, ['snippet', 'title'], 'Untitled Video'),
            thumbnail: safeExtract(video, ['snippet', 'thumbnails', 'high', 'url']) ||
                     safeExtract(video, ['snippet', 'thumbnails', 'medium', 'url']) ||
                     safeExtract(video, ['snippet', 'thumbnails', 'default', 'url']),
            channelTitle: safeExtract(video, ['snippet', 'channelTitle'], 'Unknown Channel'),
            publishedAt: safeExtract(video, ['snippet', 'publishedAt'], new Date().toISOString()),
            viewCount: safeExtract(video, ['statistics', 'viewCount'], '0'),
            duration: duration,
            // We're already filtering out shorts, but keep this for compatibility
            isShort: false
          };
        } catch (error) {
          console.error("Error processing video item:", error);
          return null;
        }
      })
      .filter(Boolean) // Remove any null items from processing errors
      // Filter for videos with thumbnails
      .filter((video: any) => video.thumbnail);

    console.log(`Trending API: After filtering, returning ${items.length} items`);

    // If no valid items after all filtering, return an appropriate response
    if (items.length === 0) {
      console.warn("Trending API: No items remaining after filtering");
      return NextResponse.json(
        { error: 'No trending videos found that match criteria', items: [] },
        { status: 200 } // Using 200 status to allow the front-end to handle this gracefully
      );
    }

    return NextResponse.json({
      items,
      nextPageToken: response.nextPageToken
    })
  } catch (error) {
    console.error('Error in trending videos API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trending videos', details: (error as Error).message },
      { status: 500 }
    )
  }
}

function convertDurationToSeconds(duration: string): number {
  try {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
    if (!match) return 0
  
    const hours = match[1] ? parseInt(match[1]) : 0
    const minutes = match[2] ? parseInt(match[2]) : 0
    const seconds = match[3] ? parseInt(match[3]) : 0
  
    return hours * 3600 + minutes * 60 + seconds
  } catch (e) {
    console.error("Error converting duration:", e);
    return 0;
  }
} 