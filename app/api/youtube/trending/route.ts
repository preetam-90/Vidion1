import { getTrendingVideos } from "@/lib/youtube-api"
import { NextResponse } from "next/server"

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
    const maxResults = 20

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
            duration: safeExtract(video, ['contentDetails', 'duration'], 'PT10M30S'),
            isShort: safeExtract(video, ['contentDetails', 'duration'], false) ? 
              convertDurationToSeconds(video.contentDetails.duration) <= 60 : false
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