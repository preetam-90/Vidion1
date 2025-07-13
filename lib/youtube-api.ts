// YouTube API integration with multiple API keys for quota management and caching
import { videos as localVideos } from '@/data'
import type { Video } from '@/data'

// Properly parse API keys - ensure we're getting clean, usable keys
const API_KEYS = process.env.NEXT_PUBLIC_YOUTUBE_API_KEYS?.split(',')
  .map(key => key.trim())
  .filter(Boolean) || []

console.log(`Loaded ${API_KEYS.length} YouTube API keys`)

if (API_KEYS.length === 0) {
  console.warn('⚠️ WARNING: No YouTube API keys found. Using fallback data only.')
}

// Cache durations in seconds
const CACHE_DURATIONS = {
  VIDEO: 24 * 60 * 60, // 24 hours for video details
  CHANNEL: 7 * 24 * 60 * 60, // 7 days for channel details
  SEARCH: 60 * 60, // 1 hour for search results
  TRENDING: 0, // Disable caching for trending videos to ensure fresh results
  COMMENTS: 12 * 60 * 60, // 12 hours for comments
  CATEGORIES: 7 * 24 * 60 * 60, // 7 days for categories
}

// Simple in-memory cache
const memoryCache = new Map<string, { data: any; timestamp: number }>()

// API key rotation and quota management
class APIKeyManager {
  private static instance: APIKeyManager
  private keys: { key: string; quotaUsed: number; lastReset: number; disabled: boolean }[] = []
  private currentKeyIndex: number = 0
  private readonly QUOTA_LIMIT = 10000 // Daily quota limit per key
  private readonly QUOTA_RESET_INTERVAL = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
  private lastStatusCheck: number = 0

  constructor() {
    // Reset the instance when creating a new one
    this.resetInstance()
  }

  private resetInstance() {
    this.keys = API_KEYS.map(key => ({
      key,
      quotaUsed: 0,
      lastReset: Date.now(),
      disabled: false
    }))
    this.currentKeyIndex = 0
    this.lastStatusCheck = Date.now()
    
    // Log API key status
    console.log(`API Key Manager initialized with ${this.keys.length} keys`)
  }

  static getInstance() {
    if (!APIKeyManager.instance) {
      APIKeyManager.instance = new APIKeyManager()
    }
    return APIKeyManager.instance
  }

  // Get status of API keys
  getKeyStatus() {
    return {
      totalKeys: this.keys.length,
      activeKeys: this.keys.filter(k => !k.disabled).length,
      disabledKeys: this.keys.filter(k => k.disabled).length,
      availableQuota: this.keys.reduce((total, key) => 
        !key.disabled ? total + (this.QUOTA_LIMIT - key.quotaUsed) : total, 0),
      anyAvailable: this.keys.some(k => !k.disabled && k.quotaUsed < this.QUOTA_LIMIT),
      lastChecked: this.lastStatusCheck
    }
  }

  // Run a single validation test to check if API keys are working
  async validateKeys() {
    // Only check once per hour
    const now = Date.now()
    if (now - this.lastStatusCheck < 60 * 60 * 1000) {
      console.log('Key validation was done recently, skipping')
      return this.getKeyStatus()
    }
    
    this.lastStatusCheck = now
    let validKeys = 0
    
    for (let i = 0; i < this.keys.length; i++) {
      const key = this.keys[i].key
      if (this.keys[i].disabled) continue
      
      try {
        // Make a lightweight call to test the key
        const params = new URLSearchParams({
          part: 'id',
          maxResults: '1',
          chart: 'mostPopular',
          key
        })
        
        const url = `https://www.googleapis.com/youtube/v3/videos?${params}`
        const response = await fetch(url, { 
          method: 'HEAD', // Use HEAD to avoid wasting quota
          cache: 'no-store'
        })
        
        if (response.ok) {
          validKeys++
          console.log(`API key ${i} is valid`)
        } else if (response.status === 403 || response.status === 429) {
          console.warn(`API key ${i} appears to be over quota or invalid`)
          this.disableKey(i)
        }
      } catch (error) {
        console.error(`Error validating API key ${i}:`, error)
      }
    }
    
    console.log(`Key validation complete: ${validKeys} of ${this.keys.length} keys are valid`)
    return this.getKeyStatus()
  }

  private resetQuotaIfNeeded(keyData: { quotaUsed: number; lastReset: number; disabled: boolean }) {
    const now = Date.now()
    if (now - keyData.lastReset >= this.QUOTA_RESET_INTERVAL) {
      keyData.quotaUsed = 0
      keyData.lastReset = now
      keyData.disabled = false // Re-enable key after reset period
      console.log(`API key quota reset completed`)
    }
  }

  private findAvailableKey() {
    // Check if we have any keys at all
    if (this.keys.length === 0) {
      console.error('No API keys available')
      return -1
    }
    
    const startIndex = this.currentKeyIndex
    let triedAllKeys = false
    
    do {
      const keyData = this.keys[this.currentKeyIndex]
      this.resetQuotaIfNeeded(keyData)

      if (!keyData.disabled && keyData.quotaUsed < this.QUOTA_LIMIT) {
        return this.currentKeyIndex
      }

      this.currentKeyIndex = (this.currentKeyIndex + 1) % this.keys.length
      
      // Check if we've tried all keys
      if (this.currentKeyIndex === startIndex) {
        triedAllKeys = true
      }
    } while (!triedAllKeys)

    // If all keys are disabled or over quota, try to find the least used one
    let leastUsedIndex = -1
    let leastUsedQuota = Infinity
    
    for (let i = 0; i < this.keys.length; i++) {
      const keyData = this.keys[i]
      if (!keyData.disabled && keyData.quotaUsed < leastUsedQuota) {
        leastUsedQuota = keyData.quotaUsed
        leastUsedIndex = i
      }
    }
    
    return leastUsedIndex
  }

  getNextKey() {
    const index = this.findAvailableKey()
    if (index === -1) {
      console.error('All YouTube API keys are disabled or over quota')
      throw new Error('QUOTA_EXCEEDED')
    }
    return this.keys[index].key
  }

  disableKey(index: number) {
    if (index >= 0 && index < this.keys.length) {
      console.warn(`Disabling API key at index ${index} due to errors`)
      this.keys[index].disabled = true
      this.currentKeyIndex = (this.currentKeyIndex + 1) % this.keys.length
    }
  }

  incrementQuota(units: number = 1) {
    if (this.currentKeyIndex >= 0 && this.currentKeyIndex < this.keys.length) {
      const keyData = this.keys[this.currentKeyIndex]
      keyData.quotaUsed += units
      
      // If current key reached quota, move to next key
      if (keyData.quotaUsed >= this.QUOTA_LIMIT) {
        console.warn(`API key at index ${this.currentKeyIndex} reached quota limit`)
        this.currentKeyIndex = (this.currentKeyIndex + 1) % this.keys.length
      }
    }
  }

  async executeWithQuota<T>(
    fn: (apiKey: string) => Promise<T>,
    quotaCost: number = 1,
    retries: number = Math.max(this.keys.length, 3)
  ): Promise<T> {
    // Quick check if any keys are available
    const status = this.getKeyStatus()
    if (!status.anyAvailable) {
      console.warn('No API keys available with quota remaining')
      throw new Error('QUOTA_EXCEEDED: All YouTube API keys are over quota')
    }
    
    let lastError: Error | null = null

    for (let i = 0; i < retries; i++) {
      try {
        const apiKey = this.getNextKey()
        const result = await fn(apiKey)
        this.incrementQuota(quotaCost)
        return result
      } catch (error: any) {
        lastError = error
        const errorMessage = error?.message || ''
        
        // Handle different error types
        if (
          errorMessage === 'QUOTA_EXCEEDED' || 
          errorMessage.includes('quota') || 
          (errorMessage.includes('403') && errorMessage.includes('quota'))
        ) {
          console.warn(`API key quota exceeded, trying next key... (${i + 1}/${retries})`)
          this.incrementQuota(this.QUOTA_LIMIT) // Mark current key as exhausted
          continue // Try next key
        } else if (errorMessage.includes('403') || errorMessage.includes('401')) {
          // Likely invalid key, disable it
          console.warn(`API key appears invalid (${errorMessage}), disabling key at index ${this.currentKeyIndex}`)
          this.disableKey(this.currentKeyIndex)
          continue
        }
        
        // For other errors, try next key without marking as exhausted
        console.warn(`API error (non-quota): ${errorMessage}, trying next key... (${i + 1}/${retries})`)
        this.currentKeyIndex = (this.currentKeyIndex + 1) % this.keys.length
        continue
      }
    }

    // If we get here, all keys have failed - use fallback data
    console.warn('All API keys failed. Using fallback data.')
    
    // Re-throw the last error if it indicates no API keys are available
    if (lastError && lastError.message === 'QUOTA_EXCEEDED') {
      throw lastError
    }
    
    return this.getFallbackData() as T
  }

  private getFallbackData() {
    // Return a sample video that matches our interface
    return [{
      id: 'fallback-1',
      snippet: {
        title: 'Sample Video',
        description: 'This is a fallback video when API quota is exceeded.',
        thumbnails: {
          high: { url: '/placeholder-video.jpg' },
          medium: { url: '/placeholder-video.jpg' },
          default: { url: '/placeholder-video.jpg' }
        },
        channelTitle: 'Sample Channel',
        publishedAt: new Date().toISOString(),
        channelId: 'fallback-channel'
      },
      statistics: {
        viewCount: '1000',
        likeCount: '100',
        commentCount: '10'
      },
      contentDetails: {
        duration: 'PT10M30S'
      }
    }]
  }
}

// Export utility functions for checking API key status
export function getYouTubeAPIStatus() {
  const manager = APIKeyManager.getInstance()
  return manager.getKeyStatus()
}

export async function validateYouTubeAPIKeys() {
  const manager = APIKeyManager.getInstance()
  return await manager.validateKeys()
}

// Helper function to create a new APIKeyManager instance
export function createAPIKeyManager(): APIKeyManager {
  return new APIKeyManager();
}

// Export the APIKeyManager class as well
export { APIKeyManager };

// Memory cache wrapper function
function withMemoryCache<T>(key: string, duration: number, fetchFn: () => Promise<T>): Promise<T> {
  const cached = memoryCache.get(key)
  const now = Date.now()

  if (cached && now - cached.timestamp < duration * 1000) {
    return Promise.resolve(cached.data)
  }

  return fetchFn().then(data => {
    memoryCache.set(key, { data, timestamp: now })
    return data
  })
}

const BASE_URL = "https://www.googleapis.com/youtube/v3"

export interface YouTubeVideo {
  id: string
  snippet: {
    title: string
    description: string
    thumbnails: {
      high?: {
        url: string;
        width?: number;
        height?: number;
      };
      medium?: {
        url: string;
        width?: number;
        height?: number;
      };
      default: {
        url: string;
        width?: number;
        height?: number;
      };
    }
    channelTitle: string
    publishedAt: string
    channelId: string
  }
  statistics?: {
    viewCount?: string
    likeCount?: string
    commentCount?: string
  }
  contentDetails?: {
    duration?: string
  }
}

export interface YouTubeChannel {
  id: string
  snippet: {
    title: string
    description: string
    thumbnails: {
      default: {
        url: string
      }
      medium: {
        url: string
      }
      high: {
        url: string
      }
    }
  }
  statistics: {
    subscriberCount: string
    videoCount: string
  }
}

export interface YouTubeComment {
  id: string
  snippet: {
    topLevelComment: {
      snippet: {
        authorDisplayName: string
        authorProfileImageUrl: string
        textDisplay: string
        publishedAt: string
        likeCount: number
      }
    }
    totalReplyCount: number
  }
  replies?: {
    comments: YouTubeCommentReply[]
  }
}

export interface YouTubeCommentReply {
  id: string
  snippet: {
    authorDisplayName: string
    authorProfileImageUrl: string
    textDisplay: string
    publishedAt: string
    likeCount: number
  }
}

// Convert YouTube video to our Video format
export const convertYouTubeVideoToVideo = (ytVideo: YouTubeVideo) => {
  // Extract video ID - handle both full URLs and IDs
  const videoId = ytVideo.id.includes('watch?v=') 
    ? ytVideo.id.split('watch?v=')[1]
    : ytVideo.id;

  return {
    id: videoId, // Use the cleaned video ID
    title: ytVideo.snippet.title,
    thumbnail:
      ytVideo.snippet.thumbnails.high?.url ||
      ytVideo.snippet.thumbnails.medium?.url ||
      ytVideo.snippet.thumbnails.default?.url,
    description: ytVideo.snippet.description,
    views: parseInt(ytVideo.statistics?.viewCount || "0", 10),
    uploader: ytVideo.snippet.channelTitle,
    uploadDate: ytVideo.snippet.publishedAt,
    likes: parseInt(ytVideo.statistics?.likeCount || "0", 10),
    url: `https://www.youtube.com/watch?v=${videoId}`, // Set the full YouTube URL
    platform: "youtube", // Make sure platform is set to youtube
    category: "entertainment",
    comments: parseInt(ytVideo.statistics?.commentCount || "0", 10),
    channelId: ytVideo.snippet.channelId,
  }
}

// Function to fetch video details
export async function getVideoDetails(videoId: string) {
  const keyManager = APIKeyManager.getInstance()
  const cacheKey = `video:${videoId}`
  
  return withMemoryCache(cacheKey, CACHE_DURATIONS.VIDEO, () => 
    keyManager.executeWithQuota(async (apiKey) => {
      const params = new URLSearchParams({
        part: 'snippet,contentDetails,statistics',
        id: videoId,
        key: apiKey
      })

      const response = await fetch(`${BASE_URL}/videos?${params}`)
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'Failed to fetch video details')
      }

      const data = await response.json()
      return data.items?.[0] || null
    }, 1)
  )
}

// Function to fetch channel details
export async function getChannelDetails(channelId: string) {
  const keyManager = APIKeyManager.getInstance()
  const cacheKey = `channel:${channelId}`
  
  return withMemoryCache(cacheKey, CACHE_DURATIONS.CHANNEL, () =>
    keyManager.executeWithQuota(async (apiKey) => {
      const params = new URLSearchParams({
        part: 'snippet,statistics',
        id: channelId,
        key: apiKey
      })

      const response = await fetch(`${BASE_URL}/channels?${params}`, {
        next: { revalidate: CACHE_DURATIONS.CHANNEL },
        headers: { 'Accept': 'application/json' },
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'Failed to fetch channel details')
      }
      
      const data = await response.json()
      if (!data.items || data.items.length === 0) {
        throw new Error('No channel data found')
      }
      
      return data.items[0]
    }, 1)
  ).catch(error => {
    console.warn('Error fetching channel:', error)
    return {
      id: channelId,
      snippet: {
        title: 'Sample Channel',
        description: 'This is a fallback channel when API quota is exceeded.',
        thumbnails: {
          default: { url: '/placeholder-channel.jpg' },
          medium: { url: '/placeholder-channel.jpg' },
          high: { url: '/placeholder-channel.jpg' }
        }
      },
      statistics: {
        subscriberCount: '1000',
        videoCount: '10'
      }
    }
  })
}

// Function to fetch video comments
export async function getVideoComments(videoId: string, maxResults = 20) {
  const keyManager = APIKeyManager.getInstance()
  const cacheKey = `comments:${videoId}:${maxResults}`
  
  return withMemoryCache(cacheKey, CACHE_DURATIONS.COMMENTS, () =>
    keyManager.executeWithQuota(async (apiKey) => {
      const params = new URLSearchParams({
        part: 'snippet,replies',
        videoId: videoId,
        maxResults: maxResults.toString(),
        key: apiKey
      })

      const response = await fetch(`${BASE_URL}/commentThreads?${params}`, {
        next: { revalidate: CACHE_DURATIONS.COMMENTS },
        headers: { 'Accept': 'application/json' },
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'Failed to fetch comments')
      }
      
      const data = await response.json()
      if (!data.items || data.items.length === 0) {
        return getFallbackComments(maxResults)
      }
      
      return data.items
    }, 1) // Cost is 1 unit per request
  ).catch(error => {
    console.warn('Error fetching comments:', error)
    return getFallbackComments(maxResults)
  })
}

// Helper function to generate fallback comments
function getFallbackComments(maxResults = 20): YouTubeComment[] {
  const now = Date.now()
  const day = 24 * 60 * 60 * 1000 // 1 day in milliseconds

  // Generate some sample comments that exactly match the YouTube API format
  const sampleComments: YouTubeComment[] = [
    {
      id: 'comment1',
      snippet: {
        topLevelComment: {
          snippet: {
            authorDisplayName: 'User1',
            authorProfileImageUrl: '/placeholder-user.jpg',
            textDisplay: 'Great video! Very informative and well-presented.',
            publishedAt: new Date(now - day).toISOString(),
            likeCount: 15
          }
        },
        totalReplyCount: 1,
      },
      replies: {
        comments: [
          {
            id: 'reply1',
            snippet: {
              authorDisplayName: 'User2',
              authorProfileImageUrl: '/placeholder-user.jpg',
              textDisplay: 'I agree! Learned a lot from this.',
              publishedAt: new Date(now - day / 2).toISOString(),
              likeCount: 5
            }
          }
        ]
      }
    },
    {
      id: 'comment2',
      snippet: {
        topLevelComment: {
          snippet: {
            authorDisplayName: 'User3',
            authorProfileImageUrl: '/placeholder-user.jpg',
            textDisplay: 'Thanks for sharing this content. Looking forward to more videos like this!',
            publishedAt: new Date(now - 2 * day).toISOString(),
            likeCount: 10
          }
        },
        totalReplyCount: 0
      }
    },
    {
      id: 'comment3',
      snippet: {
        topLevelComment: {
          snippet: {
            authorDisplayName: 'User4',
            authorProfileImageUrl: '/placeholder-user.jpg',
            textDisplay: 'This helped me understand the topic much better.',
            publishedAt: new Date(now - 3 * day).toISOString(),
            likeCount: 8
          }
        },
        totalReplyCount: 1,
      },
      replies: {
        comments: [
          {
            id: 'reply2',
            snippet: {
              authorDisplayName: 'User5',
              authorProfileImageUrl: '/placeholder-user.jpg',
              textDisplay: 'Same here! Very clear explanations.',
              publishedAt: new Date(now - 2.5 * day).toISOString(),
              likeCount: 3
            }
          }
        ]
      }
    }
  ]

  // Return a subset of sample comments based on maxResults
  return sampleComments.slice(0, maxResults)
}

// Function to search videos with optimized caching and batching
export async function searchVideos(query: string, maxResults = 20, pageToken?: string) {
  const keyManager = APIKeyManager.getInstance()
  const cacheKey = `search:${query}:${maxResults}:${pageToken || 'initial'}`
  
  return withMemoryCache(cacheKey, CACHE_DURATIONS.SEARCH, () =>
    keyManager.executeWithQuota(async (apiKey) => {
      const params = new URLSearchParams({
        part: 'snippet',
        q: query,
        maxResults: maxResults.toString(),
        type: 'video',
        key: apiKey,
        ...(pageToken ? { pageToken } : {})
      })

      const response = await fetch(`${BASE_URL}/search?${params}`, {
        next: { revalidate: CACHE_DURATIONS.SEARCH },
        headers: { 'Accept': 'application/json' },
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'Failed to search videos')
      }

      const data = await response.json()
      if (!data.items || data.items.length === 0) {
        return {
          items: getFallbackVideos(query, maxResults),
          nextPageToken: null
        }
      }

      // Get video IDs and use batch processor
      const videoIds = data.items.map((item: any) => item.id.videoId)
      const videoDetails = await Promise.all(
        videoIds.map((id: string) => VideoBatchProcessor.getInstance().add(id))
      )
      
      return {
        items: videoDetails.filter(Boolean),
        nextPageToken: data.nextPageToken || null
      }
    }, 100)
  ).catch(error => {
    console.warn('Error searching videos:', error)
    return {
      items: getFallbackVideos(query, maxResults),
      nextPageToken: null
    }
  })
}

// Helper function to get fallback videos from local data
function getFallbackVideos(query: string, maxResults = 20) {
  // Filter local videos based on query
  const filteredVideos = localVideos
    .filter(
      (video: Video) =>
        video.title.toLowerCase().includes(query.toLowerCase()) ||
        video.description.toLowerCase().includes(query.toLowerCase()) ||
        video.uploader.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, maxResults)
    
  // If no videos match the query, return a subset of all videos
  const videosToUse = filteredVideos.length > 0 ? filteredVideos : localVideos.slice(0, maxResults)
  
  // Convert local videos to YouTube format for consistency
  return videosToUse.map(video => ({
    id: video.id.toString(),
    snippet: {
      title: video.title,
      description: video.description,
      thumbnails: {
        high: { url: video.thumbnail },
        medium: { url: video.thumbnail },
        default: { url: video.thumbnail }
      },
      channelTitle: video.uploader,
      publishedAt: video.uploadDate,
      channelId: 'local-channel'
    },
    statistics: {
      viewCount: typeof video.views === 'string' ? video.views : video.views.toString(),
      likeCount: typeof video.likes === 'string' ? video.likes : video.likes.toString(),
      commentCount: typeof video.comments === 'string' ? video.comments : video.comments.toString()
    },
    contentDetails: {
      duration: video.duration || 'PT10M30S' // Default duration if not available
    }
  }))
}

// Function to get trending videos with caching
export async function getTrendingVideos(regionCode = "US", maxResults = 50, pageToken?: string, videoCategoryId?: string) {
  const keyManager = APIKeyManager.getInstance()
  const cacheKey = `trending:${regionCode}:${maxResults}:${pageToken || 'initial'}:${videoCategoryId || 'all'}`
  
  return withMemoryCache(cacheKey, CACHE_DURATIONS.TRENDING, () =>
    keyManager.executeWithQuota(async (apiKey) => {
      const params = new URLSearchParams({
        part: 'snippet,contentDetails,statistics',
        chart: 'mostPopular',
        regionCode,
        maxResults: maxResults.toString(),
        key: apiKey,
        ...(pageToken ? { pageToken } : {}),
        ...(videoCategoryId ? { videoCategoryId } : {})
      })

      try {
        const response = await fetch(`${BASE_URL}/videos?${params}`, {
          // Disable cache to avoid stale results
          cache: 'no-store',
          next: { revalidate: 0 }
        })
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: { message: 'Unknown error' } }))
          console.error('YouTube trending API error:', errorData)
          throw new Error(errorData.error?.message || `Failed to fetch trending videos: ${response.status}`)
        }

        const data = await response.json()
        if (!data.items || data.items.length === 0) {
          console.warn('No trending videos returned from API, using fallback data')
          return getFallbackTrendingVideos(maxResults, videoCategoryId)
        }

        return {
          items: data.items,
          nextPageToken: data.nextPageToken,
          pageInfo: data.pageInfo
        }
      } catch (error) {
        console.error('Error in getTrendingVideos:', error)
        throw error
      }
    }, 100)
  ).catch(error => {
    console.warn('Error fetching trending videos, using fallback data:', error)
    return getFallbackTrendingVideos(maxResults, videoCategoryId)
  })
}

// Helper function to get fallback trending videos
function getFallbackTrendingVideos(maxResults = 20, videoCategoryId?: string) {
  // Get a random subset of local videos for trending
  let filteredVideos = localVideos;
  
  // Filter by category if provided
  if (videoCategoryId) {
    // For gaming category (20), filter videos with gaming category
    if (videoCategoryId === '20') {
      filteredVideos = localVideos.filter(video => 
        video.category.toLowerCase() === 'gaming' || 
        video.category.toLowerCase() === 'game'
      );
    }
    // For movies/film category (1), filter videos with movies category
    else if (videoCategoryId === '1') {
      filteredVideos = localVideos.filter(video => 
        video.category.toLowerCase() === 'movies' || 
        video.category.toLowerCase() === 'film' ||
        video.category.toLowerCase() === 'cinema'
      );
    }
    // For news category (25), filter videos with news category
    else if (videoCategoryId === '25') {
      filteredVideos = localVideos.filter(video => 
        video.category.toLowerCase() === 'news' || 
        video.category.toLowerCase() === 'politics' ||
        video.category.toLowerCase() === 'current affairs'
      );
    }
  }
  
  const trendingVideos = filteredVideos
    .sort(() => 0.5 - Math.random())
    .slice(0, maxResults)
    .map(video => ({
      id: video.id.toString(),
      snippet: {
        title: video.title,
        description: video.description,
        thumbnails: {
          high: { url: video.thumbnail },
          medium: { url: video.thumbnail },
          default: { url: video.thumbnail }
        },
        channelTitle: video.uploader,
        publishedAt: video.uploadDate,
        channelId: 'local-channel'
      },
      statistics: {
        viewCount: typeof video.views === 'string' ? video.views : video.views.toString(),
        likeCount: typeof video.likes === 'string' ? video.likes : video.likes.toString(),
        commentCount: typeof video.comments === 'string' ? video.comments : video.comments.toString()
      },
      contentDetails: {
        duration: video.duration || 'PT10M30S'
      }
    }))

  return {
    items: trendingVideos,
    nextPageToken: null,
    pageInfo: {
      totalResults: trendingVideos.length,
      resultsPerPage: maxResults
    }
  }
}

// Function to get videos by category
export async function getVideosByCategory(categoryId: string, maxResults = 20, regionCode = "US") {
  const keyManager = APIKeyManager.getInstance()
  const cacheKey = `category:${categoryId}:${maxResults}:${regionCode}`

  return withMemoryCache(cacheKey, CACHE_DURATIONS.CATEGORIES, () =>
    keyManager.executeWithQuota(async (apiKey) => {
      const params = new URLSearchParams({
        part: 'snippet,statistics,contentDetails',
        chart: 'mostPopular',
        videoCategoryId: categoryId,
        maxResults: maxResults.toString(),
        regionCode: regionCode,
        key: apiKey
      })

      const response = await fetch(`${BASE_URL}/videos?${params}`)
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'Failed to fetch videos by category')
      }

      const data = await response.json()
      return data.items || getFallbackVideosByCategory(categoryId, maxResults)
    }, 100)
  ).catch(error => {
    console.warn('Error fetching videos by category:', error)
    return getFallbackVideosByCategory(categoryId, maxResults)
  })
}

// Helper function to get fallback videos by category
function getFallbackVideosByCategory(categoryId: string, maxResults = 20) {
  // Filter local videos by category
  const filteredVideos = localVideos
    .filter(video => video.category.toLowerCase() === categoryId.toLowerCase())
    .slice(0, maxResults)
  
  // If no videos match the category, return a subset of all videos
  const fallbackVideos = filteredVideos.length > 0 ? filteredVideos : localVideos.slice(0, maxResults)
  
  // Convert to YouTube format
  return fallbackVideos.map(video => ({
    id: video.id.toString(),
    snippet: {
      title: video.title,
      description: video.description,
      thumbnails: {
        high: { url: video.thumbnail },
        medium: { url: video.thumbnail },
        default: { url: video.thumbnail }
      },
      channelTitle: video.uploader,
      publishedAt: video.uploadDate,
      channelId: 'local-channel'
    },
    statistics: {
      viewCount: typeof video.views === 'string' ? video.views : video.views.toString(),
      likeCount: typeof video.likes === 'string' ? video.likes : video.likes.toString(),
      commentCount: typeof video.comments === 'string' ? video.comments : video.comments.toString()
    }
  }))
}

// Function to search for videos by category
export async function searchVideosByCategory(categoryId: string, maxResults = 20, regionCode = "US", pageToken?: string) {
  const keyManager = APIKeyManager.getInstance();
  const cacheKey = `search-category:${categoryId}:${maxResults}:${regionCode}:${pageToken || 'initial'}`;

  return withMemoryCache(cacheKey, CACHE_DURATIONS.SEARCH, () =>
    keyManager.executeWithQuota(async (apiKey) => {
      const searchParams = new URLSearchParams({
        part: 'snippet',
        videoCategoryId: categoryId,
        type: 'video',
        maxResults: maxResults.toString(),
        regionCode: regionCode,
        key: apiKey,
        ...(pageToken ? { pageToken } : {})
      });

      const searchResponse = await fetch(`${BASE_URL}/search?${searchParams}`);
      if (!searchResponse.ok) {
        const error = await searchResponse.json();
        throw new Error(error.error?.message || 'Failed to search videos by category');
      }

      const searchData = await searchResponse.json();
      if (!searchData.items || searchData.items.length === 0) {
        return {
          items: [],
          nextPageToken: null
        };
      }

      const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');

      const detailsParams = new URLSearchParams({
        part: 'snippet,contentDetails,statistics',
        id: videoIds,
        key: apiKey,
      });

      const detailsResponse = await fetch(`${BASE_URL}/videos?${detailsParams}`);
      if (!detailsResponse.ok) {
        const error = await detailsResponse.json();
        throw new Error(error.error?.message || 'Failed to fetch video details');
      }

      const detailsData = await detailsResponse.json();
      return {
        items: detailsData.items || [],
        nextPageToken: searchData.nextPageToken || null
      };
    }, 101)
  ).catch(error => {
    console.warn('Error searching videos by category:', error);
    return {
      items: getFallbackVideosByCategory(categoryId, maxResults),
      nextPageToken: null
    };
  });
}

// Function to get related videos
export async function getRelatedVideos(videoId: string, maxResults = 10) {
  const keyManager = APIKeyManager.getInstance()
  const cacheKey = `related:${videoId}:${maxResults}`

  return withMemoryCache(cacheKey, CACHE_DURATIONS.SEARCH, () =>
    keyManager.executeWithQuota(async (apiKey) => {
      // First get related video IDs
      const searchParams = new URLSearchParams({
        part: 'snippet',
        relatedToVideoId: videoId,
        maxResults: maxResults.toString(),
        type: 'video',
        key: apiKey
      })

      const response = await fetch(`${BASE_URL}/search?${searchParams}`)
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'Failed to fetch related videos')
      }

      const data = await response.json()
      if (!data.items || data.items.length === 0) {
        return getFallbackVideos("", maxResults)
      }

      // Get video IDs from search results
      const videoIds = data.items.map((item: any) => item.id.videoId)

      // Fetch full video details
      const detailsParams = new URLSearchParams({
        part: 'snippet,statistics,contentDetails',
        id: videoIds.join(','),
        key: apiKey
      })

      const detailsResponse = await fetch(`${BASE_URL}/videos?${detailsParams}`)
      if (!detailsResponse.ok) {
        const error = await detailsResponse.json()
        throw new Error(error.error?.message || 'Failed to fetch video details')
      }

      const detailsData = await detailsResponse.json()
      return detailsData.items || getFallbackVideos("", maxResults)
    }, 101) // Cost is 100 for search + 1 for video details
  ).catch(error => {
    console.warn('Error fetching related videos:', error)
    return getFallbackVideos("", maxResults)
  })
}
// Function to get video categories
export async function getVideoCategories(regionCode = "US") {
  const keyManager = APIKeyManager.getInstance()
  const cacheKey = `categories:${regionCode}`

  return withMemoryCache(cacheKey, CACHE_DURATIONS.CATEGORIES, () =>
    keyManager.executeWithQuota(async (apiKey) => {
      const params = new URLSearchParams({
        part: 'snippet',
        regionCode: regionCode,
        key: apiKey
      })

      const response = await fetch(`${BASE_URL}/videoCategories?${params}`)
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'Failed to fetch video categories')
      }

      const data = await response.json()
      return data.items || getFallbackCategories()
    }, 1)
  ).catch(error => {
    console.warn('Error fetching categories:', error)
    return getFallbackCategories()
  })
}

// Helper function to get fallback categories
function getFallbackCategories() {
  return [
    {
      id: '1',
      snippet: { title: 'Film & Animation' }
    },
    {
      id: '2',
      snippet: { title: 'Music' }
    },
    {
      id: '10',
      snippet: { title: 'Entertainment' }
    },
    {
      id: '20',
      snippet: { title: 'Gaming' }
    },
    {
      id: '23',
      snippet: { title: 'Comedy' }
    }
  ]
}

// Batch processor for video details
class VideoBatchProcessor {
  private static instance: VideoBatchProcessor
  private batchTimeout: NodeJS.Timeout | null = null
  private batch: Set<string> = new Set()
  private callbacks: Map<string, ((data: any) => void)[]> = new Map()
  private keyManager: APIKeyManager

  private constructor() {
    this.keyManager = APIKeyManager.getInstance()
  }

  static getInstance() {
    if (!VideoBatchProcessor.instance) {
      VideoBatchProcessor.instance = new VideoBatchProcessor()
    }
    return VideoBatchProcessor.instance
  }

  async add(videoId: string): Promise<any> {
    return new Promise((resolve) => {
      this.batch.add(videoId)
      
      if (!this.callbacks.has(videoId)) {
        this.callbacks.set(videoId, [])
      }
      this.callbacks.get(videoId)?.push(resolve)

      if (!this.batchTimeout) {
        this.batchTimeout = setTimeout(() => this.processBatch(), 50) // Wait 50ms to batch requests
      }
    })
  }

  private async processBatch() {
    const batchArray = Array.from(this.batch)
    this.batch.clear()
    this.batchTimeout = null

    if (batchArray.length === 0) return

    try {
      const result = await this.keyManager.executeWithQuota(async (apiKey) => {
        const url = `${BASE_URL}/videos?part=snippet,statistics,contentDetails&id=${batchArray.join(',')}&key=${apiKey}`
        const response = await fetch(url)
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error?.message || 'Failed to fetch video details')
        }

        return response.json()
      }, batchArray.length) // Cost is 1 per video

      const videos = result.items || []

      // Store in memory cache
      for (const video of videos) {
        const cacheKey = `video:${video.id}`
        memoryCache.set(cacheKey, { data: video, timestamp: Date.now() })
      }

      // Resolve callbacks
      for (const videoId of batchArray) {
        const video = videos.find((v: any) => v.id === videoId) || null
        const callbacks = this.callbacks.get(videoId) || []
        callbacks.forEach(cb => cb(video))
        this.callbacks.delete(videoId)
      }
    } catch (error) {
      console.error('Batch processing error:', error)
      // Resolve all callbacks with null on error
      for (const videoId of batchArray) {
        const callbacks = this.callbacks.get(videoId) || []
        callbacks.forEach(cb => cb(null))
        this.callbacks.delete(videoId)
      }
    }
  }
}

// Declare the global type for YouTube API key index
declare global {
  var __ytKeyIndex: number;
}

/**
 * Get an access token for YouTube API requests
 * This is a simple implementation that uses API keys instead of OAuth
 * @returns API key as a simple token
 */
async function getAccessToken(): Promise<string> {
  // Get API keys from the same environment variable used elsewhere in the file
  const API_KEYS = process.env.NEXT_PUBLIC_YOUTUBE_API_KEYS?.split(',')
    .map(key => key.trim())
    .filter(Boolean) || [];

  if (API_KEYS.length === 0) {
    console.warn('No YouTube API keys available');
    return '';
  }

  // Get the current key index from global state or localStorage
  let currentKeyIndex = 0;
  try {
    const storedIndex = global.__ytKeyIndex ?? 0;
    currentKeyIndex = storedIndex % API_KEYS.length;
    // Update for next request
    global.__ytKeyIndex = (storedIndex + 1) % API_KEYS.length;
  } catch (error) {
    console.error('Error managing API key rotation:', error);
  }

  return API_KEYS[currentKeyIndex];
}

// Function to get comprehensive movie-related videos from India with exact specifications
export async function getComprehensiveMovieVideos(maxResults = 50, pageToken?: string, customSearchQuery?: string, regionCode = "IN") {
  const keyManager = APIKeyManager.getInstance();
  const cacheKey = `comprehensive-movies:${regionCode}:${maxResults}:${pageToken || 'initial'}:${customSearchQuery?.slice(0, 20) || 'default'}`;
  
  // Comprehensive query with multiple keywords for movie content
  const searchQuery = customSearchQuery || 
    "movie trailer OR web series OR film review OR movie explanation OR " +
    "Bollywood trailer OR Hollywood in Hindi OR web series review OR " +
    "film recap in Hindi OR Netflix India OR Amazon Prime Hindi OR " +
    "Sony LIV web series OR Hotstar trailer OR South movie explanation in Hindi OR " +
    "movie trailer reaction OR trending Indian movie clips";

  console.log(`Attempting to get movie videos for region ${regionCode} (pageToken: ${pageToken || 'initial'})`);

  try {
    return await withMemoryCache(cacheKey, CACHE_DURATIONS.SEARCH, () =>
      keyManager.executeWithQuota(async (apiKey) => {
        if (!apiKey) {
          console.error('No API key available for movie videos request');
          return getFallbackTrendingVideos(maxResults, "1");
        }

        const params = new URLSearchParams({
          part: 'snippet,contentDetails,statistics',
          q: searchQuery,
          type: 'video',
          videoEmbeddable: 'true',
          videoCategoryId: '1', // Film & Animation category
          regionCode: regionCode, // Customizable region code, default to India
          maxResults: maxResults.toString(),
          order: 'viewCount', // Sort by view count
          key: apiKey,
          ...(pageToken ? { pageToken } : {})
        });

        try {
          console.log(`Making YouTube search API request with key length: ${apiKey.length}`);
          const response = await fetch(`${BASE_URL}/search?${params}`, {
            cache: 'no-store',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            console.error(`YouTube API error: ${response.status} ${response.statusText}`);
            let errorData;
            try {
              errorData = await response.json();
              console.error('YouTube API error details:', errorData);
            } catch (e) {
              console.error('Could not parse error response:', e);
            }
            return getFallbackTrendingVideos(maxResults, "1");
          }

          let searchData;
          try {
            searchData = await response.json();
          } catch (e) {
            console.error('Failed to parse search response:', e);
            return getFallbackTrendingVideos(maxResults, "1");
          }

          console.log(`YouTube search API returned ${searchData?.items?.length || 0} results`);
          
          if (!searchData?.items || searchData.items.length === 0) {
            console.warn('No movie videos returned from API search');
            return getFallbackTrendingVideos(maxResults, "1"); // Use movie category fallback
          }

          // Extract video IDs for detailed info
          const videoIds = searchData.items
            .filter((item: any) => item && item.id && item.id.videoId)
            .map((item: any) => item.id.videoId);
          
          if (!videoIds || videoIds.length === 0) {
            console.warn('No valid video IDs found');
            return getFallbackTrendingVideos(maxResults, "1");
          }
          
          // Get detailed video information
          const detailsParams = new URLSearchParams({
            part: 'snippet,contentDetails,statistics',
            id: videoIds.join(','),
            key: apiKey
          });

          console.log(`Fetching details for ${videoIds.length} videos`);
          const detailsResponse = await fetch(`${BASE_URL}/videos?${detailsParams}`, {
            cache: 'no-store',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });
          
          if (!detailsResponse.ok) {
            console.error(`YouTube details API error: ${detailsResponse.status} ${detailsResponse.statusText}`);
            let errorData;
            try {
              errorData = await detailsResponse.json();
              console.error('YouTube details API error:', errorData);
            } catch (e) {
              console.error('Could not parse details error response:', e);
            }
            return getFallbackTrendingVideos(maxResults, "1");
          }

          let detailsData;
          try {
            detailsData = await detailsResponse.json();
          } catch (e) {
            console.error('Failed to parse details response:', e);
            return getFallbackTrendingVideos(maxResults, "1");
          }
          
          console.log(`YouTube details API returned ${detailsData?.items?.length || 0} video details`);
          
          if (!detailsData?.items || detailsData.items.length === 0) {
            console.warn('No video details returned from API');
            return getFallbackTrendingVideos(maxResults, "1");
          }

          // Filter for videos with duration over 10 minutes (long-form content)
          const filteredItems = detailsData.items
            .filter((item: any) => item && typeof item === 'object')
            .filter((item: any) => {
              try {
                if (!item.contentDetails?.duration) return false;
                
                const match = item.contentDetails.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
                if (!match) return false;
                
                const hours = match[1] ? parseInt(match[1]) : 0;
                const minutes = match[2] ? parseInt(match[2]) : 0;
                
                return hours > 0 || minutes >= 10; // Only videos 10+ minutes
              } catch (e) {
                console.error("Error filtering video by duration:", e);
                return false;
              }
            });

          console.log(`After filtering for long-form content, ${filteredItems.length} videos remain`);

          if (filteredItems.length === 0) {
            console.warn('No videos matching criteria after filtering');
            return getFallbackTrendingVideos(maxResults, "1");
          }

          return {
            items: filteredItems,
            nextPageToken: searchData.nextPageToken,
            pageInfo: searchData.pageInfo
          };
        } catch (error) {
          console.error('Error in getComprehensiveMovieVideos internal try block:', error);
          return getFallbackTrendingVideos(maxResults, "1");
        }
      }, 200) // This costs 200 quota units (100 for search + 100 for video details)
    );
  } catch (error) {
    console.error('Error fetching comprehensive movie videos, using fallback data:', error);
    return getFallbackTrendingVideos(maxResults, "1");
  }
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

// Function to get YouTube Shorts
export async function getYouTubeShorts(maxResults = 20) {
  const keyManager = APIKeyManager.getInstance()
  const cacheKey = `shorts:${maxResults}`

  return withMemoryCache(cacheKey, CACHE_DURATIONS.SEARCH, () =>
    keyManager.executeWithQuota(async (apiKey) => {
      const params = new URLSearchParams({
        part: 'snippet,contentDetails,statistics',
        maxResults: maxResults.toString(),
        type: 'video',
        videoDuration: 'short',
        key: apiKey
      })

      const response = await fetch(`${BASE_URL}/search?${params}`)
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'Failed to fetch shorts')
      }

      const data = await response.json()
      if (!data.items || data.items.length === 0) {
        return getFallbackShorts(maxResults)
      }

      // Get video IDs from search results
      const videoIds = data.items
        .map((item: any) => item.id.videoId)
        .filter(Boolean)

      if (videoIds.length === 0) {
        return getFallbackShorts(maxResults)
      }

      // Fetch full video details
      const detailsParams = new URLSearchParams({
        part: 'snippet,statistics,contentDetails',
        id: videoIds.join(','),
        key: apiKey
      })

      const detailsResponse = await fetch(`${BASE_URL}/videos?${detailsParams}`)
      if (!detailsResponse.ok) {
        const error = await detailsResponse.json()
        throw new Error(error.error?.message || 'Failed to fetch video details')
      }

      const detailsData = await detailsResponse.json()
      if (!detailsData.items) {
        return getFallbackShorts(maxResults)
      }

      // Filter for actual shorts (duration <= 60 seconds)
      const shorts = detailsData.items
        .filter((video: any) => {
          if (!video.contentDetails?.duration) return false
          const duration = convertDurationToSeconds(video.contentDetails.duration)
          return duration <= 60
        })
        .map((video: any) => ({
          id: video.id,
          title: video.snippet.title,
          thumbnail: video.snippet.thumbnails.high?.url || 
                    video.snippet.thumbnails.medium?.url || 
                    video.snippet.thumbnails.default?.url,
          channelTitle: video.snippet.channelTitle,
          publishedAt: video.snippet.publishedAt,
          viewCount: video.statistics?.viewCount || '0',
          duration: video.contentDetails?.duration || 'PT60S',
          description: video.snippet.description,
          platform: 'youtube',
          category: 'shorts',
          isShort: true,
          url: `https://www.youtube.com/shorts/${video.id}`,
          likes: video.statistics?.likeCount || '0',
          comments: video.statistics?.commentCount || '0'
        }))

      return shorts.length > 0 ? shorts : getFallbackShorts(maxResults)
    }, 101) // Cost is 100 for search + 1 for video details
  ).catch(error => {
    console.warn('Error fetching shorts:', error)
    return getFallbackShorts(maxResults)
  })
}

// Helper function to get fallback shorts from local videos
function getFallbackShorts(maxResults = 20) {
  const shorts = localVideos
    .filter(video => video.isShort === true)
    .concat(
      localVideos
        .filter(video => !video.isShort)
        .slice(0, 10)
        .map(video => ({ ...video, isShort: true }))
    )
    .slice(0, maxResults)
    .map(video => ({
      ...video,
      platform: 'youtube',
      category: 'shorts',
      url: `https://www.youtube.com/shorts/${video.id}`
    }))

  return shorts
}
