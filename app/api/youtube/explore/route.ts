import { NextResponse } from "next/server"
import { searchVideos } from "@/lib/youtube-api"

// Cache duration in seconds
const CACHE_DURATION = 3600; // 1 hour

// Cache for storing video results
const videoCache = new Map<string, {
  data: any[];
  timestamp: number;
}>();

// Helper function to get cached data
const getCachedData = (key: string) => {
  const cached = videoCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION * 1000) {
    return cached.data;
  }
  return null;
};

// Helper function to set cached data
const setCachedData = (key: string, data: any[]) => {
  videoCache.set(key, {
    data,
    timestamp: Date.now()
  });
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'all'
    const regionCode = searchParams.get('region') || 'IN'
    const maxResults = 20

    // Check cache first
    const cacheKey = `${category}_${regionCode}`;
    const cachedVideos = getCachedData(cacheKey);
    if (cachedVideos) {
      return NextResponse.json(
        { videos: cachedVideos },
        {
          headers: {
            'Cache-Control': `public, max-age=${CACHE_DURATION}, stale-while-revalidate=86400`,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Define search queries based on category
    const categoryQueries: Record<string, string[]> = {
      music: ['bollywood songs', 'indian music', 'latest songs'],
      gaming: ['gaming india', 'mobile gaming', 'pc gaming india'],
      news: ['india news', 'latest news india', 'breaking news india'],
      education: ['educational videos india', 'online learning', 'study tips'],
      entertainment: ['entertainment india', 'comedy videos', 'funny videos'],
      sports: ['cricket highlights', 'sports india', 'football india'],
      technology: ['tech news india', 'gadget reviews', 'tech tutorials'],
      travel: ['travel india', 'tourist places', 'travel vlog'],
      food: ['indian food', 'cooking recipes', 'street food india'],
      fashion: ['fashion india', 'style tips', 'beauty tutorials']
    }

    // If category is 'all', get videos from all categories
    const queries = category === 'all' 
      ? Object.values(categoryQueries).flat()
      : categoryQueries[category] || ['trending videos india']

    // Randomly select a query
    const randomQuery = queries[Math.floor(Math.random() * queries.length)]

    const response = await searchVideos(randomQuery, maxResults)
    
    if (!response || !Array.isArray(response)) {
      throw new Error('Failed to fetch videos')
    }

    const videos = response.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      viewCount: item.statistics?.viewCount || '0',
      duration: item.contentDetails?.duration || 'PT10M30S',
      category,
      description: item.snippet.description || '',
      views: item.statistics?.viewCount || '0',
      uploader: item.snippet.channelTitle,
      uploadDate: item.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      likes: item.statistics?.likeCount || '0',
      comments: item.statistics?.commentCount || '0',
      platform: 'youtube'
    }))

    // Cache the results
    setCachedData(cacheKey, videos);

    // Set cache headers
    const headers = new Headers({
      'Cache-Control': `public, max-age=${CACHE_DURATION}, stale-while-revalidate=86400`,
      'Content-Type': 'application/json'
    });

    return NextResponse.json({ videos }, { headers })
  } catch (error) {
    console.error('Error in explore API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch explore videos', details: (error as Error).message },
      { status: 500 }
    )
  }
} 