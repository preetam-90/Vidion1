import { getComprehensiveMovieVideos } from "@/lib/youtube-api"
import { NextResponse } from "next/server"

interface YouTubeResponse {
  items: any[];
  nextPageToken?: string;
  pageInfo?: {
    totalResults: number;
    resultsPerPage: number;
  };
}

interface VideoItem {
  id: string;
  snippet: Record<string, any>;
  statistics: Record<string, any>;
  contentDetails: Record<string, any>;
  title: string;
  thumbnail: string | null;
  thumbnailDetails: Record<string, any>;
  channelTitle: string;
  publishedAt: string;
  viewCount: string;
  duration: string;
  description: string;
  isShort: boolean;
}

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

// Helper function to safely extract values from potentially undefined nested objects
function safeExtract(obj: any, path: string[], defaultValue: any = undefined) {
  return path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : defaultValue), obj);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const pageToken = searchParams.get('pageToken') || undefined
    const customSearchQuery = searchParams.get('q') || undefined
    const regionCode = searchParams.get('region') || "IN"
    const maxResults = parseInt(searchParams.get('maxResults') || '20', 10)

    // Set a timeout for the API request
    const TIMEOUT_MS = 10000
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), TIMEOUT_MS)
    })

    // Fetch data with timeout
    const responsePromise = getComprehensiveMovieVideos(maxResults, pageToken || undefined, customSearchQuery, regionCode)
    
    // Race between timeout and actual response
    const response = await Promise.race([responsePromise, timeoutPromise]) as YouTubeResponse
    
    // Check if we got a valid response
    if (!response || !response.items) {
      console.warn("Movies API: No response or items, returning empty result")
      return NextResponse.json({
        items: [],
        nextPageToken: null,
        message: 'No videos found'
      })
    }

    console.log(`Movies API: Raw response has ${response.items.length} items and nextPageToken: ${response.nextPageToken || 'none'}`)

    // Safely process items
    let items: VideoItem[] = []
    try {
      items = response.items
        .filter((video: any) => video && typeof video === 'object')
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
            } as VideoItem
          } catch (error) {
            console.error("Error processing video item:", error)
            return null
          }
        })
        .filter((video): video is VideoItem => video !== null) // Type guard to remove nulls
        .filter((video) => video.thumbnail !== null) // Filter videos without thumbnails

    } catch (error) {
      console.error("Error processing video items:", error)
      items = []
    }

    console.log(`Movies API: After processing, returning ${items.length} items`)

    return NextResponse.json({
      items,
      nextPageToken: response.nextPageToken || null,
      pageInfo: response.pageInfo || { totalResults: items.length, resultsPerPage: maxResults }
    })

  } catch (error) {
    console.error("Movies API Error:", error)
    return NextResponse.json(
      { error: 'Failed to fetch movies', details: (error as Error).message },
      { status: 500 }
    )
  }
} 