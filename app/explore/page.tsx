"use client"

import React, { useEffect, useState, useCallback, useRef } from "react"
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useInView } from "react-intersection-observer"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import SharePopup from "@/components/share-popup"
import { ReportDialog } from "@/components/report-dialog"
import { FeedbackDialog } from "@/components/feedback-dialog"
import { VideoOptionsDropdown } from "./components/VideoOptionsDropdown"
import { Skeleton } from '@/components/ui/skeleton'
import VideoCard from '@/app/components/VideoCard'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface Video {
  id: string | number
  title: string
  thumbnail: string
  channelTitle: string
  publishedAt: string
  viewCount: string
  duration: string
  description: string
  views: string
  uploader: string
  uploadDate: string
  url: string
  likes: string
  comments: string
  platform: string
  category: string
}

const CATEGORIES = [
  { id: 'music', name: 'Music' },
  { id: 'gaming', name: 'Gaming' },
  { id: 'news', name: 'News' },
  { id: 'education', name: 'Education' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'sports', name: 'Sports' },
  { id: 'technology', name: 'Technology' },
  { id: 'travel', name: 'Travel' },
  { id: 'food', name: 'Food' },
  { id: 'fashion', name: 'Fashion' }
]

const CACHE_DURATION = 1 * 60 * 60 * 1000; // 1 hour in milliseconds

// --- Dynamic Cache Key Functions ---
const getVideoCacheKey = (category: string) => `explore_videos_cache_${category || 'all'}`;
const getTimestampCacheKey = (category: string) => `explore_timestamp_cache_${category || 'all'}`;
// Keep New To You global as it's category independent
const CACHE_KEY_NEW_TO_YOU = 'explore_new_to_you_cache'; 
const CACHE_KEY_NEW_TO_YOU_TIMESTAMP = 'explore_new_to_you_timestamp_cache'; 

export default function ExplorePage() {
  const router = useRouter()
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [initialFetch, setInitialFetch] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [nextPageToken, setNextPageToken] = useState<string | null>(null)
  const [nextQueryIndex, setNextQueryIndex] = useState<number>(0)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const { toast } = useToast()
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [apiStatus, setApiStatus] = useState<{
    activeKeys: number;
    totalKeys: number;
    quotaReset?: string;
  } | null>(null)
  const [newToYouVideos, setNewToYouVideos] = useState<Video[]>([])
  const [loadingNewToYou, setLoadingNewToYou] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  })

  // --- Helper: Get data from localStorage ---
  const getCachedData = <T,>(key: string): T | null => {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (e) {
      console.error(`Error reading cache key ${key}:`, e);
      localStorage.removeItem(key); // Remove potentially corrupted item
      return null;
    }
  };

  // --- Helper: Set data to localStorage ---
  const setCachedData = (key: string, data: any) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`Error setting cache key ${key}:`, e);
      // Optionally handle quota exceeded errors here
    }
  };
  
  // --- Fetch New To You Videos (with cache check) ---
  const fetchNewToYouVideosWithCache = async (): Promise<Video[]> => {
    setLoadingNewToYou(true);
    const timestampKey = CACHE_KEY_NEW_TO_YOU_TIMESTAMP;
    const dataKey = CACHE_KEY_NEW_TO_YOU;

    // Check cache first
    const cachedTimestamp = getCachedData<number>(timestampKey);
    if (cachedTimestamp && (Date.now() - cachedTimestamp < CACHE_DURATION)) {
      const cachedData = getCachedData<Video[]>(dataKey);
      if (cachedData && Array.isArray(cachedData)) {
        console.log('Loading New To You videos from cache.');
        setLoadingNewToYou(false);
        return cachedData;
      }
    }

    // Fetch fresh data if cache miss or stale
    console.log('Fetching New To You videos from API...');
    try {
      const categories = ['music', 'gaming', 'news', 'movies', 'education'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const response = await fetch(`/api/youtube/search?q=${randomCategory}&maxResults=5`);
      if (!response.ok) throw new Error('Failed to fetch new videos');
      
      const data = await response.json();
      const validVideos = (data.videos || []).filter((video: Video) => 
        video && typeof video === 'object' && video.id && video.title
      );
      
      // Update cache
      setCachedData(dataKey, validVideos);
      setCachedData(timestampKey, Date.now());
      console.log('Updated New To You cache.');
      
      return validVideos;
    } catch (err) {
      console.error('Error fetching new to you videos:', err);
      return []; // Return empty on error, don't update cache
    } finally {
      setLoadingNewToYou(false);
    }
  }

  // --- Fetch Main Grid Videos (API call only) ---
  // Removed setLoading(true) from here, handled by caller
  const fetchVideos = async (category: string): Promise<Video[]> => {
    try {
      setError(null); 
      console.log(`Fetching videos for category '${category}' from API...`);
      const response = await fetch(`/api/youtube/explore?category=${category}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch videos for category ${category}`);
      }
      const data = await response.json();
      if (!data.videos || data.videos.length === 0) {
        console.warn('No videos found for category:', category);
        return []; 
      }
      const validVideos = data.videos.filter((video: Video) => 
        video && typeof video === 'object' && video.id && video.title
      );
      return validVideos;
    } catch (error) {
      console.error(`Error fetching videos for category ${category}:`, error);
      // Avoid setting global error for category-specific fetch? Maybe just toast.
      toast({
        title: "Error",
        description: `Failed to fetch videos for ${category}. Please try again later.`,
        variant: "destructive",
      });
      return []; // Return empty on error
    }
  }

  // --- Load Category Videos (Handles cache check & fetch for main grid) ---
  const loadCategoryVideos = async (category: string) => {
    setLoading(true); // Show loading indicator for the main grid
    setError(null);
    const timestampKey = getTimestampCacheKey(category);
    const dataKey = getVideoCacheKey(category);

    // Check cache
    const cachedTimestamp = getCachedData<number>(timestampKey);
    if (cachedTimestamp && (Date.now() - cachedTimestamp < CACHE_DURATION)) {
      const cachedData = getCachedData<Video[]>(dataKey);
      if (cachedData && Array.isArray(cachedData)) {
        console.log(`Loading videos for category '${category}' from cache.`);
        setVideos(cachedData);
        setLoading(false);
        return; // Exit early, use cached data
      } else {
         console.warn(`Invalid cache structure for category ${category}`);
         localStorage.removeItem(dataKey); // Clean up bad cache
         localStorage.removeItem(timestampKey);
      }
    }
    
    // Fetch fresh data if cache miss or stale
    try {
      const fetchedVideos = await fetchVideos(category);
      setVideos(fetchedVideos);
      
      // Update cache
      setCachedData(dataKey, fetchedVideos);
      setCachedData(timestampKey, Date.now());
      console.log(`Updated video cache for category '${category}'.`);
      
    } catch (err) {
        // Error is already logged in fetchVideos, maybe set global error here?
        setError(`Failed to load videos for ${category}.`);
    } finally {
        setLoading(false); // Stop loading indicator
    }
  };

  // --- Fetch Initial Data (Runs once on mount) ---
  const fetchInitialVideos = async () => {
    setInitialFetch(true); // Indicate initial load process
    
    // Load main videos for the initially selected category (respecting cache)
    await loadCategoryVideos(selectedCategory); 
    
    // Load "New to You" videos (respecting its own cache)
    const newToYou = await fetchNewToYouVideosWithCache();
    setNewToYouVideos(newToYou); // Update state after fetch/cache check

    setInitialFetch(false); // Mark initial load complete
  };

  // --- Handle Category Change ---
  const handleCategoryChange = (category: string) => {
    if (category === selectedCategory) return; // Do nothing if same category clicked
    
    console.log(`Changing category to: ${category}`);
    setSelectedCategory(category);
    // Load videos for the new category (will check cache first)
    loadCategoryVideos(category); 
    // Reset load more state for the new category (assuming explore API doesn't paginate)
    setHasMore(true); // Or false, depending on explore API behavior
    setNextPageToken(null); 
    setNextQueryIndex(0);
  };

  // --- Initial fetch on mount ---
  useEffect(() => {
    fetchInitialVideos();
  }, []); // << ENSURE this dependency array is empty to run only once

  const loadMoreVideos = async () => {
    // Don't attempt to load more if we're already loading or there's nothing more to load
    if (loadingMore || !hasMore) return
    
    try {
      setLoadingMore(true)
      console.log('Loading more videos with token:', nextPageToken, 'queryIndex:', nextQueryIndex)
      
      // Construct URL with pagination parameters
      const params = new URLSearchParams()
      if (nextPageToken) params.append('pageToken', nextPageToken)
      params.append('queryIndex', nextQueryIndex.toString())
      
      const apiUrl = `/api/youtube/home?${params.toString()}`
      const response = await fetch(apiUrl, {
        cache: 'no-store',
        next: { revalidate: 0 }
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('API Error when loading more:', response.status, errorData)
        throw new Error(`API error: ${response.status} ${errorData.error || ''}`)
      }
      
      const data = await response.json()
      console.log('More videos API response:', data)
      
      if (data.videos && data.videos.length > 0) {
        // Filter out duplicates before adding new videos
        const existingIds = new Set(videos.map(v => v.id))
        const newVideos = data.videos.filter((v: Video) => !existingIds.has(v.id))
        
        if (newVideos.length > 0) {
          setVideos(prev => [...prev, ...newVideos])
        } else {
          console.log('No new videos after filtering duplicates')
        }
        
        // Update pagination tokens
        setNextPageToken(data.nextPageToken)
        setNextQueryIndex(data.nextQueryIndex || 0)
        setHasMore(!!data.nextPageToken || (data.nextQueryIndex !== nextQueryIndex))
      } else {
        console.log('No more videos available or empty response')
        // If we get back no videos but have a new query index, we can try that
        if (data.nextQueryIndex !== undefined && data.nextQueryIndex !== nextQueryIndex) {
          setNextQueryIndex(data.nextQueryIndex)
          setNextPageToken(null)
          setHasMore(true)
        } else {
          setHasMore(false)
        }
      }
    } catch (err) {
      console.error('Failed to load more videos:', err)
      // Don't set error state for load more failures, just log it
      // But we can retry automatically after a delay
      setTimeout(() => {
        setRetryCount(prev => prev + 1)
        if (retryCount < 3) {
          setHasMore(true) // Enable retry
        }
      }, 3000)
    } finally {
      setLoadingMore(false)
    }
  }

  // Load more when scrolled to bottom and inView becomes true
  useEffect(() => {
    if (inView && !initialFetch && !loading) {
      loadMoreVideos()
    }
  }, [inView, initialFetch, loading])

  // Retry initial fetch if we have an error, but clear quota error status first
  const handleRetry = () => {
    // Clear quota error status when user manually retries
    try {
      localStorage.removeItem('youtube_quota_exceeded')
      localStorage.removeItem('youtube_quota_error_time')
    } catch (e) {
      console.warn('Error removing localStorage items:', e)
    }
    
    setRetryCount(prev => prev + 1)
    fetchInitialVideos()
  }

  const handleVideoClick = (video: Video) => {
    try {
      // Validate video data
      if (!video || typeof video !== 'object' || !video.id) {
        console.error('Invalid video data:', video);
        toast({
          title: "Error",
          description: "Invalid video data. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Store video data in sessionStorage for player page
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('currentVideo', JSON.stringify(video));
      }

      // Navigate to the video page with the correct ID
      router.push(`/video/${String(video.id)}`);
    } catch (error) {
      console.error('Error handling video click:', error);
      toast({
        title: "Error",
        description: "Could not play video. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleShare = (video: Video) => {
    setSelectedVideo(video)
    setIsShareOpen(true)
  }

  const handleReport = (video: Video) => {
    setSelectedVideo(video)
    setIsReportOpen(true)
  }

  // Render loading skeletons while fetching initial data
  if (loading && initialFetch) {
    return (
      <div className="flex flex-col gap-6 pb-10 container mx-auto px-4 md:px-6">
        <h1 className="text-3xl font-bold mt-6">Explore</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="aspect-video rounded-xl" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const RegularVideoCard = ({ video, index }: { video: Video, index: number }) => {
    // Validate video data before rendering
    if (!video || typeof video !== 'object') {
      console.warn('Invalid video data received:', video);
      return null;
    }

    return (
      <div 
        className="group relative cursor-pointer rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg"
        onClick={() => handleVideoClick(video)}
      >
        <div className="aspect-video relative overflow-hidden rounded-xl bg-muted">
          <Image
            src={video.thumbnail || '/placeholder-video.jpg'}
            alt={video.title || 'Video thumbnail'}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-video.jpg';
            }}
          />
          <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1 py-0.5 text-xs text-white">
            {video.duration || '0:00'}
          </div>
        </div>
        
        <div className="p-2">
          <div className="flex gap-2 items-start">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium line-clamp-2 text-base group-hover:text-primary">
                {video.title || 'Untitled Video'}
              </h3>
              <div className="flex flex-col text-sm text-muted-foreground mt-1">
                <span className="truncate">{video.channelTitle || video.uploader || 'Unknown Channel'}</span>
                <div className="flex items-center gap-1">
                  <span>{video.viewCount || video.views || '0'} views</span>
                  <span>•</span>
                  <span>{formatDate(video.publishedAt || video.uploadDate)}</span>
                </div>
              </div>
            </div>
            <div className="pt-1">
              <VideoOptionsDropdown 
                video={video} 
                onShare={() => {
                  setSelectedVideo(video)
                  setIsShareOpen(true)
                }}
                onFeedback={() => {
                  setSelectedVideo(video)
                  setIsFeedbackOpen(true)
                }}
                onReport={() => {
                  setSelectedVideo(video)
                  setIsReportOpen(true)
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render error state with retry button
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">Something went wrong</h2>
        <p className="mb-6 text-muted-foreground">{error}</p>
        <Button onClick={handleRetry}>
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 pb-20 container max-w-full xl:max-w-[90%] 2xl:max-w-[95%] mx-auto px-4 md:px-6">
      <div className="mt-6">
        <h1 className="text-3xl font-bold">Explore</h1>
        <p className="text-muted-foreground mt-1">Discover new videos from India</p>
      </div>

      {/* Main Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
        {videos.map((video: Video, idx) => {
          // Validate video data before rendering (including ID)
          if (!video || typeof video !== 'object' || !video.id) {
            console.warn('Skipping render for invalid video data in grid:', video);
            return <div key={`invalid-${idx}`} />;
          }
          // Add log to see what's being rendered
          // console.log('Rendering VideoCard for:', video.id, video.title);
          return (
            <VideoCard
              key={`${video.id}-${idx}`} // Key is safe now because we checked video.id
              video={video}
              onClick={() => handleVideoClick(video)}
            />
          );
        })}
      </div>

      {/* Load More / Loading Indicator */}
      {!initialFetch && (
        <div ref={ref} className="flex justify-center items-center py-8">
          {loadingMore ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading more videos...</span>
            </div>
          ) : hasMore ? (
            <Button variant="outline" onClick={loadMoreVideos}>
              Load More
            </Button>
          ) : (
            <p className="text-muted-foreground">No more videos to load</p>
          )}
        </div>
      )}

      {/* Dialogs */}
      <SharePopup
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        url={selectedVideo ? `${typeof window !== 'undefined' ? window.location.origin : ''}/video/${selectedVideo.id}` : ''}
        title={selectedVideo?.title || 'Check out this video'}
      />
      
      <ReportDialog 
        isOpen={isReportOpen} 
        onClose={() => setIsReportOpen(false)}
        onSubmit={() => {
          setIsReportOpen(false)
          toast({
            title: "Report submitted",
            description: "Thank you for your feedback.",
          })
        }}
      />
      
      <FeedbackDialog 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)}
        onSubmit={() => {
          setIsFeedbackOpen(false)
          toast({
            title: "Feedback submitted",
            description: "Thank you for your feedback.",
          })
        }}
      />
    </div>
  )
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 1) {
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    if (diffHours < 1) {
      const diffMinutes = Math.ceil(diffTime / (1000 * 60));
      if (diffMinutes < 1) {
        return 'just now';
      }
      return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  if (diffDays < 7) {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  }
  
  if (diffDays < 30) {
    const diffWeeks = Math.floor(diffDays / 7);
    return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`;
  }
  
  if (diffDays < 365) {
    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
  }
  
  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
}