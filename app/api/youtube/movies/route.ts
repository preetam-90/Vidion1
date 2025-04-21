import { getComprehensiveMovieVideos } from "@/lib/youtube-api"
import { NextResponse } from "next/server"

// Helper function to convert ISO 8601 duration to seconds
function convertDurationToSeconds(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0
  
  const hours = parseInt(match[1] || '0')
  const minutes = parseInt(match[2] || '0')
  const seconds = parseInt(match[3] || '0')
  
  return hours * 3600 + minutes * 60 + seconds
}

// Helper to check if a video is likely 16:9 format based on thumbnail dimensions
const is16by9Ratio = (thumbnail: any): boolean => {
  // Check if high resolution thumbnail exists and its dimensions
  const highThumbnail = thumbnail?.high
  if (highThumbnail && highThumbnail.width && highThumbnail.height) {
    // Standard 16:9 resolution is 1280x720, 640x360, etc.
    const ratio = highThumbnail.width / highThumbnail.height
    return Math.abs(ratio - 16/9) < 0.1 // Allow small margin of error
  }
  
  // Default to true if we can't determine (most YouTube videos are 16:9)
  return true
}

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
    console.log("Movies API route called");
    
    const { searchParams } = new URL(request.url)
    const pageToken = searchParams.get('pageToken')
    const maxResults = 50 // Fixed to 50 for comprehensive results
    const regionCode = searchParams.get('region') || 'IN' // Default to India

    // Build an extremely comprehensive search query
    const searchQuery = [
      "movie trailer", "web series", "bollywood trailer", "hollywood in hindi", 
      "movie explanation", "film review", "movie review", "web series trailer", 
      "south indian movie", "south movie hindi", "netflix india", "amazon prime video india", 
      "hotstar trailer", "sony liv series", "zee5 originals", "hindi dubbed movie", 
      "tamil movie hindi", "telugu movie explanation", "malayalam movie review", 
      "kannada movie hindi", "film recap", "movie recap in hindi", "movie breakdown", 
      "film summary", "thriller explanation", "suspense movie recap", "indian cinema", 
      "hindi cinema", "bollywood full movie", "action movie hindi", "comedy movie hindi", 
      "romantic movie review", "new movie 2024", "hindi movie trailer", "hindi web series", 
      "movie reaction hindi", "film theory hindi", "south indian movie in hindi", 
      "hindi dubbed trailer", "trending bollywood", "box office india", "best movie 2023", 
      "upcoming movie trailer", "movie facts hindi", "movie explanation channel", 
      "psychological thriller hindi", "horror movie hindi", "mystery movie review", 
      "underrated movie hindi", "cult movie explanation", "hindi dubbed web series", 
      "youtube movies india", "movie discussion hindi", "cinema explained", 
      "movie critic hindi", "drama movie review"
    ].join(" OR ");

    console.log(`Movies API: Using search query for region ${regionCode}, pageToken: ${pageToken || 'initial'}`);

    // Add timeout to avoid hanging requests
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('API request timeout')), 8000);
    });

    // Fetch data with timeout
    const responsePromise = getComprehensiveMovieVideos(maxResults, pageToken || undefined, searchQuery, regionCode);
    
    // Race between timeout and actual response
    const response = await Promise.race([responsePromise, timeoutPromise])
      .catch(error => {
        console.error('Error fetching movie videos:', error);
        // Return fallback instead of throwing
        return { 
          items: [], 
          nextPageToken: null 
        };
      });
    
    // Check if we got a valid response
    if (!response || !response.items) {
      console.warn("Movies API: No response or items, returning empty result");
      return NextResponse.json({
        items: [],
        error: "No videos found",
        nextPageToken: null
      }, { status: 200 });
    }

    console.log(`Movies API: Raw response has ${response.items.length} items and nextPageToken: ${response.nextPageToken || 'none'}`);

    // Safely process items
    let items = [];
    try {
      items = response.items
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
              thumbnailDetails: safeExtract(video, ['snippet', 'thumbnails'], {}),
              channelTitle: safeExtract(video, ['snippet', 'channelTitle'], 'Unknown Channel'),
              publishedAt: safeExtract(video, ['snippet', 'publishedAt'], new Date().toISOString()),
              viewCount: safeExtract(video, ['statistics', 'viewCount'], '0'),
              duration: safeExtract(video, ['contentDetails', 'duration'], 'PT10M30S'),
              description: safeExtract(video, ['snippet', 'description'], ''),
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

      // Only apply these filters if we have items to filter
      if (items.length > 0) {
        // Filter for 16:9 videos based on thumbnail dimensions
        items = items.filter((video: any) => {
          try {
            return is16by9Ratio(video.thumbnailDetails);
          } catch (e) {
            console.error("Error in aspect ratio check:", e);
            return true; // Default to including the video
          }
        });
        
        // Filter for videos longer than 10 minutes
        items = items.filter((video: any) => {
          try {
            const duration = video.duration;
            if (!duration) return false;
            
            const seconds = convertDurationToSeconds(duration);
            return seconds >= 10 * 60; // 10 minutes minimum
          } catch (e) {
            console.error("Error in duration check:", e);
            return false;
          }
        });
      }
    } catch (error) {
      console.error("Error processing video items:", error);
      items = []; // Reset to empty array on error
    }

    console.log(`Movies API: After filtering, returning ${items.length} items`);

    // If no valid items after all filtering, return an error
    if (items.length === 0) {
      console.warn("Movies API: No items remaining after filtering");
      return NextResponse.json({
        error: 'No movie videos found that match criteria', 
        items: [],
        nextPageToken: null
      }, { status: 200 }); // Using 200 status to allow the front-end to handle this gracefully
    }

    return NextResponse.json({
      items,
      nextPageToken: response.nextPageToken
    });
  } catch (error) {
    console.error('Error in movies videos API:', error);
    // Return a 200 response with error info to prevent client-side errors
    return NextResponse.json({
      error: 'Failed to fetch movie videos', 
      details: (error as Error).message,
      items: []
    }, { status: 200 });
  }
} 