import { NextRequest, NextResponse } from 'next/server'

// Remove edge runtime to allow access to server-side environment variables
// export const runtime = 'edge'

const API_KEYS = (process.env.YOUTUBE_API_KEYS || process.env.NEXT_PUBLIC_YOUTUBE_API_KEYS || '')
  .split(',')
  .map(key => key.trim())
  .filter(Boolean)

let currentKeyIndex = 0

// Programming-related keywords as requested
const PROGRAMMING_KEYWORDS = [
  "Programming",
  "Flowcharts",
  "Patterns",
  "Arrays",
  "Sorting",
  "Searching",
  "Recursion",
  "Pointers",
  "Linked Lists",
  "Stacks",
  "Queues",
  "Trees",
  "Binary Search Trees",
  "Heaps",
  "Hashmaps",
  "Tries",
  "Dynamic Programming",
  "Graphs",
  "Greedy Algorithm",
  "Bit Manipulation",
  "Strings",
  "Algorithms",
  "Data Structures",
  "Interview",
  "Resume",
  "Placement",
  "Mathematics",
  "Number Systems",
  "Complexity Analysis",
  "Matrix",
  "Subarrays",
  "Traversal",
  "Palindrome",
  "Zig-Zag",
  "Binary Search",
  "Prime Numbers",
  "Factorial",
  "Temperature Conversion",
  "Stock Span",
  "Celebrity Problem",
  "K-Sum Paths",
  "Vertical Order",
  "Diagonal",
  "Mirror Trees",
  "Diameter",
  "Balanced Trees",
  "Substrings",
  "Anagram",
  "Wildcard Matching",
  "Decode String"
];

const VIDEOS_PER_PAGE = 12;

async function fetchWithRotatingKeys(url: string) {
  // Keep track of failures
  let quotaErrors = 0
  let otherErrors = 0
  const totalKeys = API_KEYS.length
  
  for (let i = 0; i < API_KEYS.length; i++) {
    const keyIndex = (currentKeyIndex + i) % API_KEYS.length
    const key = API_KEYS[keyIndex]
    try {
      console.log(`Trying API key ${keyIndex}...`)
      const response = await fetch(`${url}&key=${key}`)
      
      if (response.ok) {
        currentKeyIndex = (keyIndex + 1) % API_KEYS.length // Rotate key for next call
        return await response.json()
      } else {
        const errorText = await response.text().catch(() => '')
        console.warn(`API key ${keyIndex} failed with status ${response.status}. Error: ${errorText}`)
        
        if (response.status === 403 || response.status === 429) {
          console.warn(`API key ${keyIndex} quota exceeded or key invalid. Trying next key.`)
          quotaErrors++
          continue
        } else {
          otherErrors++
          throw new Error(`API request failed with status ${response.status}: ${errorText}`)
        }
      }
    } catch (error) {
      console.error(`Error with API key ${keyIndex}:`, error)
      otherErrors++
    }
  }
  
  // If all failures were quota-related, send a clear quota exceeded error
  if (quotaErrors === totalKeys) {
    throw new Error('QUOTA_EXCEEDED: All API keys have reached their quota limits.')
  }
  
  throw new Error(`All API keys failed or exhausted. ${quotaErrors} keys hit quota limits. ${otherErrors} keys had other errors.`)
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const pageToken = searchParams.get('pageToken') || undefined
  const queryIndex = parseInt(searchParams.get('queryIndex') || '0', 10) % PROGRAMMING_KEYWORDS.length;
  const currentQuery = PROGRAMMING_KEYWORDS[queryIndex];
  const regionCode = searchParams.get('regionCode') || 'IN'; // Default to India, but allow override

  try {
    // Check if we have any valid API keys
    if (!API_KEYS || API_KEYS.length === 0) {
      console.error('No YouTube API keys configured')
      return NextResponse.json({ 
        error: 'YouTube API is not configured correctly. Please check your API keys.',
        videos: [] 
      }, { status: 503 })
    }
    
    // Step 1: Search for videos using search.list
    const searchParamsObj: Record<string, string> = {
      part: 'snippet',
      q: currentQuery,
      type: 'video',
      maxResults: String(VIDEOS_PER_PAGE),
      regionCode: regionCode,
      videoDefinition: 'high',
      relevanceLanguage: 'en',
      order: 'relevance', // Get most relevant results for programming topics
      videoDuration: 'medium', // Filter out short videos
      videoType: 'any'
    }

    if (pageToken) {
      searchParamsObj.pageToken = pageToken
    }

    const searchUrl = 'https://www.googleapis.com/youtube/v3/search?' + new URLSearchParams(searchParamsObj)
    const searchData = await fetchWithRotatingKeys(searchUrl)

    if (!searchData.items || searchData.items.length === 0) {
      // If no results for current query, move to next query without a page token
      return NextResponse.json({ videos: [], nextPageToken: null, nextQueryIndex: (queryIndex + 1) % PROGRAMMING_KEYWORDS.length }, { status: 200 })
    }

    const videoIds = searchData.items
      .map((item: any) => item.id?.videoId)
      .filter((id: string | undefined): id is string => !!id) // Filter out undefined/null IDs and ensure type string
      .join(',')

    if (!videoIds) {
      // No valid video IDs found, move to next query
      return NextResponse.json({ videos: [], nextPageToken: searchData.nextPageToken || null, nextQueryIndex: (queryIndex + 1) % PROGRAMMING_KEYWORDS.length }, { status: 200 })
    }

    // Step 2: Fetch details for the found video IDs using videos.list
    const detailsParams: Record<string, string> = {
      part: 'snippet,contentDetails,statistics',
      id: videoIds,
      maxResults: String(VIDEOS_PER_PAGE),
    }
    const detailsUrl = 'https://www.googleapis.com/youtube/v3/videos?' + new URLSearchParams(detailsParams)
    const detailsData = await fetchWithRotatingKeys(detailsUrl)
    
    const detailsMap = new Map();
    if (detailsData.items && detailsData.items.length > 0) {
      detailsData.items.forEach((item: any) => detailsMap.set(item.id, item));
    } else {
        console.warn("No details found for video IDs:", videoIds);
        // Still return search results page token, but move query index
        return NextResponse.json({ videos: [], nextPageToken: searchData.nextPageToken || null, nextQueryIndex: (queryIndex + 1) % PROGRAMMING_KEYWORDS.length }, { status: 200 })
    }
    
    // Step 3: Combine search snippet data with video details
    const videos = searchData.items
      .map((item: any) => {
        const videoId = item.id?.videoId;
        if (!videoId) return null; 
        
        const details = detailsMap.get(videoId);
        if (!details) { 
            console.warn(`Details missing for video ID: ${videoId}`);
            return null; // Skip if details weren't found (maybe deleted)
        }

        // Safely access properties using optional chaining
        const detailSnippet = details.snippet;
        const searchSnippet = item.snippet;
        const detailStats = details.statistics;
        const detailContent = details.contentDetails;
        
        // Check if this is a short video by examining thumbnails aspect ratio
        const thumbnailUrl = detailSnippet?.thumbnails?.high?.url || searchSnippet?.thumbnails?.high?.url || '';
        const thumbnailWidth = detailSnippet?.thumbnails?.high?.width || searchSnippet?.thumbnails?.high?.width || 0;
        const thumbnailHeight = detailSnippet?.thumbnails?.high?.height || searchSnippet?.thumbnails?.high?.height || 0;
        
        // If aspect ratio is portrait (height > width), it's likely a short
        if (thumbnailHeight > thumbnailWidth) {
          console.log(`Filtering out portrait video: ${videoId}`);
          return null;
        }
        
        // Check duration to filter out shorts (less than 1 minute)
        const durationStr = detailContent?.duration || '';
        const durationMatch = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (durationMatch) {
          const hours = durationMatch[1] ? parseInt(durationMatch[1]) : 0;
          const minutes = durationMatch[2] ? parseInt(durationMatch[2]) : 0;
          const seconds = durationMatch[3] ? parseInt(durationMatch[3]) : 0;
          
          // If duration is less than 1 minute, consider it a short
          if (hours === 0 && minutes === 0 && seconds < 60) {
            console.log(`Filtering out short duration video: ${videoId}`);
            return null;
          }
        }

        return {
          id: videoId,
          title: detailSnippet?.title || searchSnippet?.title || 'Untitled',
          thumbnail: thumbnailUrl,
          channelTitle: detailSnippet?.channelTitle || searchSnippet?.channelTitle || 'Unknown Channel',
          publishedAt: detailSnippet?.publishedAt || searchSnippet?.publishedAt || new Date().toISOString(),
          viewCount: detailStats?.viewCount || '0', // Return raw view count
          duration: formatDuration(durationStr),
          category: 'programming', // Add programming category
        };
      })
      .filter((video: any): video is object => video !== null); // Filter out any null entries

    // Determine next query index. Only advance if there's no pageToken for the *current* query.
    const nextQueryIndex = !searchData.nextPageToken 
        ? (queryIndex + 1) % PROGRAMMING_KEYWORDS.length 
        : queryIndex;
    // If there *is* a next page for the current query, use its token. Otherwise, use null (will trigger next query).
    const nextPageTokenForClient = searchData.nextPageToken || null; 

    return NextResponse.json({
      videos,
      nextPageToken: nextPageTokenForClient,
      nextQueryIndex,
      currentQuery // Return the current query for reference
    })
  } catch (error) {
    console.error('Error in YouTube API programming route:', error)
    
    // Check if error is related to API keys
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (errorMessage.includes('QUOTA_EXCEEDED')) {
      console.warn('All YouTube API keys have reached quota limits')
      
      return NextResponse.json({ 
        error: 'YouTube API quota exceeded for all keys. Please try again tomorrow.',
        details: errorMessage,
        quotaExceeded: true,
        videos: [] // Return empty videos array for client to handle
      }, { status: 429 })
    } else if (errorMessage.includes('API key') || errorMessage.includes('quota')) {
      console.warn('YouTube API quota exceeded or key issue')
      
      return NextResponse.json({ 
        error: 'YouTube API quota exceeded. Please try again later.',
        details: errorMessage,
        videos: [] // Return empty videos array for client to handle
      }, { status: 429 })
    }
    
    return NextResponse.json({ 
      error: 'Failed to fetch videos. Please try again later.',
      details: errorMessage,
      videos: [] // Return empty videos array for client to handle
    }, { status: 500 })
  }
}

function formatDuration(duration: string) {
  if (!duration) return '';
  
  // Match hours, minutes, and seconds from ISO 8601 duration format
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '';
  
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}