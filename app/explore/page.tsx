"use client"

// Updated Explore page with UI improvements and focus outline bug fixes - Latest version

import React, { useEffect, useState, useCallback, useRef } from "react"
import { Loader2, ChevronLeft, ChevronRight, Eye, Clock } from "lucide-react"
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
import VideoCard from '@/components/VideoCard'
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

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const SKELETON_COUNT = 8; // Reduced skeleton count for faster initial render

// --- Dynamic Cache Key Functions ---
const getVideoCacheKey = (category: string) => `explore_videos_cache_${category || 'all'}`;
const getTimestampCacheKey = (category: string) => `explore_timestamp_cache_${category || 'all'}`;
// Keep New To You global as it's category independent
const CACHE_KEY_NEW_TO_YOU = 'explore_new_to_you_cache'; 
const CACHE_KEY_NEW_TO_YOU_TIMESTAMP = 'explore_new_to_you_timestamp_cache'; 

// Add preloader module 
let globalPreloadPromise: Promise<any> | null = null;

// Move formatViewCount to the top of the file, before any other functions that might use it
const formatViewCount = (count: string | number | undefined): string => {
  if (count === undefined || count === null) return "0 views";
  
  // Convert to number regardless of input type
  let numCount: number;
  if (typeof count === "string") {
    // Remove any non-numeric characters
    const cleanString = count.replace(/[^0-9]/g, '');
    numCount = parseInt(cleanString);
  } else {
    numCount = count;
  }
  
  // Check for NaN after conversion
  if (isNaN(numCount)) return "0 views";
  
  try {
    if (numCount >= 1_000_000_000) {
      return (numCount / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B views";
    }
    if (numCount >= 1_000_000) {
      return (numCount / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M views";
    }
    if (numCount >= 1_000) {
      return (numCount / 1_000).toFixed(1).replace(/\.0$/, "") + "K views";
    }
    return numCount.toString() + " views";
  } catch (error) {
    console.error("Error formatting view count:", error);
    return "0 views";
  }
}

// Functions to format dates, reused across the codebase
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
  const fetchVideos = async (category: string): Promise<Video[]> => {
    try {
      setError(null);
      console.log(`Fetching videos for category '${category}' from API...`);
      
      // Use AbortController for faster timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`/api/youtube/explore?category=${category}`, {
        next: { revalidate: 3600 },
        headers: {
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch videos for category ${category}`);
      }
      
      const data = await response.json();
      if (!data.videos || data.videos.length === 0) {
        console.warn('No videos found for category:', category);
        return [];
      }
      
      // Process videos in chunks to improve performance
      const validVideos = data.videos.map((video: any) => {
        // Calculate view count from any possible source
        let viewCount = '0';
        
        if (video.statistics?.viewCount) {
          viewCount = video.statistics.viewCount;
        } else if (video.viewCount) {
          viewCount = video.viewCount;
        } else if (video.views) {
          viewCount = typeof video.views === 'number' ? String(video.views) : video.views;
        }
        
        // Format the view count for display
        const formattedViews = formatViewCount(viewCount);
        
        return {
          ...video,
          views: formattedViews, // This is the displayed view count string
          viewCount: viewCount,  // Keep original for sorting/filtering
        };
      }).filter((video: Video) => 
        video && typeof video === 'object' && video.id && video.title
      );
      
      return validVideos;
    } catch (error) {
      console.error(`Error fetching videos for category ${category}:`, error);
      // Only show toast for non-abort errors
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        toast({
          title: "Error",
          description: `Failed to fetch videos for ${category}. Using cached data if available.`,
          variant: "destructive",
        });
      }
      return [];
    }
  }

  // --- Load Category Videos (Handles cache check & fetch for main grid) ---
  const loadCategoryVideos = async (category: string) => {
    // Force loading to true for explicit loading state
    console.log("Setting loading state to true in loadCategoryVideos");
    setLoading(true);
    setError(null);
    const timestampKey = getTimestampCacheKey(category);
    const dataKey = getVideoCacheKey(category);

    // Check cache first - prioritize cache over network
    const cachedTimestamp = getCachedData<number>(timestampKey);
    if (cachedTimestamp && (Date.now() - cachedTimestamp < CACHE_DURATION)) {
      const cachedData = getCachedData<Video[]>(dataKey);
      if (cachedData && Array.isArray(cachedData) && cachedData.length > 0) {
        console.log(`Loading videos for category '${category}' from cache. ${cachedData.length} videos found.`);
        
        // Use cached data immediately
        setVideos(cachedData);
        console.log("Setting loading state to false after using cache");
        setLoading(false);
        setInitialFetch(false);
        
        // Optionally update cache in background after a while (silent refresh)
        setTimeout(() => {
          if (navigator.onLine) {
            fetchVideos(category)
              .then(freshVideos => {
                if (freshVideos.length > 0) {
                  console.log(`Silently updated cache for '${category}' with ${freshVideos.length} videos.`);
                  setCachedData(dataKey, freshVideos);
                  setCachedData(timestampKey, Date.now());
                }
              })
              .catch(err => console.error('Silent refresh error:', err));
          }
        }, 10000); // Wait 10 seconds before trying a silent refresh
        
        return;
      }
    }

    try {
      // Show loading state immediately
      // setVideos([]);  - Don't clear videos until we have new ones
      
      // Fetch fresh data
      console.log("Fetching fresh videos from API");
      const fetchedVideos = await fetchVideos(category);
      
      if (fetchedVideos.length === 0) {
        // If fetch failed but we have older cache, use it anyway (expired but better than nothing)
        const oldCachedData = getCachedData<Video[]>(dataKey);
        if (oldCachedData && Array.isArray(oldCachedData) && oldCachedData.length > 0) {
          console.log(`Using expired cache for '${category}' as API call failed.`);
          setVideos(oldCachedData);
        } else {
          setError(`No videos available for ${category}.`);
        }
      } else {
        // Update state in chunks to improve performance
        const chunkSize = 10;
        for (let i = 0; i < fetchedVideos.length; i += chunkSize) {
          const chunk = fetchedVideos.slice(i, i + chunkSize);
          setVideos(prev => [...prev, ...chunk]);
        }
        
        // Update cache
        setCachedData(dataKey, fetchedVideos);
        setCachedData(timestampKey, Date.now());
      }
    } catch (err) {
      console.error("Error loading videos:", err);
      setError(`Failed to load videos for ${category}.`);
      
      // Try to use expired cache as fallback
      const oldCachedData = getCachedData<Video[]>(dataKey);
      if (oldCachedData && Array.isArray(oldCachedData) && oldCachedData.length > 0) {
        console.log(`Using expired cache for '${category}' after error.`);
        setVideos(oldCachedData);
      }
    } finally {
      console.log("Setting loading state to false in loadCategoryVideos finally block");
      setLoading(false);
      setInitialFetch(false); // Always set initialFetch to false here
    }
  };

  // --- Fetch Initial Data (Runs once on mount) ---
  const fetchInitialVideos = async () => {
    setInitialFetch(true); // Indicate initial load process
    
    // Check if we have cached videos for the category
    const videoCacheKey = getVideoCacheKey(selectedCategory);
    const timestampKey = getTimestampCacheKey(selectedCategory);
    
    const cachedTimestamp = getCachedData<number>(timestampKey);
    const cachedVideos = getCachedData<Video[]>(videoCacheKey);
    
    // Use cache if available and not expired
    if (cachedTimestamp && (Date.now() - cachedTimestamp < CACHE_DURATION) && 
        cachedVideos && Array.isArray(cachedVideos) && cachedVideos.length > 0) {
      console.log(`Loading videos for '${selectedCategory}' from cache. ${cachedVideos.length} videos found.`);
      setVideos(cachedVideos);
      setLoading(false);
      
      // Still load "New to You" videos from cache if available
      const newToYou = await fetchNewToYouVideosWithCache();
      setNewToYouVideos(newToYou);
      
      setInitialFetch(false);
      return;
    }
    
    // If no valid cache, load from API
    await loadCategoryVideos(selectedCategory); 
    
    // Load "New to You" videos (respecting its own cache)
    const newToYou = await fetchNewToYouVideosWithCache();
    setNewToYouVideos(newToYou);

    setInitialFetch(false);
  };

  // --- Modified: Initial fetch on mount to prioritize cache ---
  useEffect(() => {
    // Prioritize cache first, API calls only if absolutely necessary
    const useCachedDataFirst = async () => {
      console.log("Setting loading state to true");
      setLoading(true);
      
      // Get cached data for selected category
      const videoCacheKey = getVideoCacheKey(selectedCategory);
      const timestampKey = getTimestampCacheKey(selectedCategory);
      
      const cachedTimestamp = getCachedData<number>(timestampKey);
      const cachedVideos = getCachedData<Video[]>(videoCacheKey);
      
      // First check: Do we have valid cached data?
      if (cachedTimestamp && (Date.now() - cachedTimestamp < CACHE_DURATION) && 
          cachedVideos && Array.isArray(cachedVideos) && cachedVideos.length > 0) {
        console.log(`Loading ${cachedVideos.length} videos from cache immediately.`);
        
        // Start with first 10 videos for immediate display
        const initialVideos = cachedVideos.slice(0, 12);
        setVideos(initialVideos);
        console.log("Setting loading state to false after cache hit");
        setLoading(false);
        
        // Then quickly load the rest in background after a tiny delay
        setTimeout(() => {
          setVideos(cachedVideos);
        }, 100);
        
        // Similarly load new-to-you from cache if available
        const newToYouCacheTimestamp = getCachedData<number>(CACHE_KEY_NEW_TO_YOU_TIMESTAMP);
        const newToYouCache = getCachedData<Video[]>(CACHE_KEY_NEW_TO_YOU);
        
        if (newToYouCacheTimestamp && (Date.now() - newToYouCacheTimestamp < CACHE_DURATION) && 
            newToYouCache && Array.isArray(newToYouCache) && newToYouCache.length > 0) {
          setNewToYouVideos(newToYouCache);
        }
        
        // Silently refresh in the background after a short delay
        setTimeout(() => {
          if (navigator.onLine) {
            globalPreloadPromise = prefetchExploreData(selectedCategory);
          }
        }, 5000);
        
        setInitialFetch(false);
        return true; // Success from cache
      }
      
      return false; // No valid cache
    };
    
    // Try cache first, then fallback to API if needed
    useCachedDataFirst().then(cacheHit => {
      if (!cacheHit) {
        // No cache hit, we need to do a full fetch
        console.log("No cache hit, doing a full fetch");
        fetchInitialVideos();
      }
    });
    
    // Start preloading other categories in the background
    setTimeout(() => {
      if (selectedCategory === 'all') {
        // Preload music, gaming, and education since they're popular
        ['music', 'gaming', 'education'].forEach(category => {
          prefetchExploreData(category);
        });
      }
    }, 10000); // Wait 10 seconds before preloading other categories
  }, []); // Empty dependency array to ensure it only runs once on mount

  // Add immediate hydration from localStorage before first render
  useEffect(() => {
    const hydrateImmediately = () => {
      try {
        if (typeof window !== 'undefined') {
          // Directly access localStorage for fastest possible data access
          const videoCacheKey = getVideoCacheKey(selectedCategory);
          const timestampKey = getTimestampCacheKey(selectedCategory);
          
          try {
            const timestampItem = localStorage.getItem(timestampKey);
            if (timestampItem) {
              const cachedTimestamp = JSON.parse(timestampItem);
              
              if (cachedTimestamp && (Date.now() - cachedTimestamp < CACHE_DURATION)) {
                const videosItem = localStorage.getItem(videoCacheKey);
                if (videosItem) {
                  const cachedVideos = JSON.parse(videosItem);
                  if (Array.isArray(cachedVideos) && cachedVideos.length > 0) {
                    console.log(`Immediate hydration with ${cachedVideos.length} videos`);
                    // Just show first 8 videos for instant rendering
                    setVideos(cachedVideos.slice(0, 8));
                    setLoading(false);
                    setInitialFetch(false);
                    setLoadingMore(false); // Explicitly set loadingMore to false
                    // Then add the rest after a tiny delay
                    setTimeout(() => setVideos(cachedVideos), 10); // Reduced from 50ms to 10ms
                  }
                }
              }
            }
          } catch (e) {
            console.error('Error during immediate hydration:', e);
          }
        }
      } catch (e) {
        // Silently fail - this is just an optimization
      }
    };
    
    // Run immediately - no dependencies, should happen before first render if possible
    hydrateImmediately();
  }, [selectedCategory]);

  // Optimize infinite scroll to avoid showing loading message when not needed
  // Load more when scrolled to bottom and inView becomes true
  const loadMoreVideos = async () => {
    if (loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      
      const params = new URLSearchParams();
      if (nextPageToken) params.append('pageToken', nextPageToken);
      params.append('queryIndex', nextQueryIndex.toString());
      
      const response = await fetch(`/api/youtube/home?${params.toString()}`, {
        cache: 'no-store',
        next: { revalidate: 0 }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.videos && data.videos.length > 0) {
        // Process videos in chunks
        const existingIds = new Set(videos.map(v => v.id));
        const newVideos = data.videos.filter((v: Video) => !existingIds.has(v.id));
        
        if (newVideos.length > 0) {
          const chunkSize = 10;
          for (let i = 0; i < newVideos.length; i += chunkSize) {
            const chunk = newVideos.slice(i, i + chunkSize);
            setVideos(prev => [...prev, ...chunk]);
          }
        }
        
        setNextPageToken(data.nextPageToken);
        setNextQueryIndex(data.nextQueryIndex || 0);
        setHasMore(!!data.nextPageToken || (data.nextQueryIndex !== nextQueryIndex));
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Failed to load more videos:', err);
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        if (retryCount < 3) {
          setHasMore(true);
        }
      }, 3000);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (inView && !initialFetch && !loading && hasMore && !loadingMore) {
      // Only load more when scrolled to bottom and not already loading
      loadMoreVideos();
    }
  }, [inView, initialFetch, loading, hasMore, loadingMore, loadMoreVideos]);

  // --- Modified: prefetchExploreData to be more efficient ---
  const prefetchExploreData = async (category = 'all') => {
    try {
      const cacheKey = getVideoCacheKey(category);
      const timestampKey = getTimestampCacheKey(category);
      
      // Skip fetch if we already have fresh data
      const cachedTimestamp = getCachedData<number>(timestampKey);
      if (cachedTimestamp && (Date.now() - cachedTimestamp < CACHE_DURATION)) {
        console.log(`Skipping prefetch for ${category} - using existing cache`);
        return;
      }
      
      console.log(`Silently prefetching data for ${category} in background`);
      
      // Use AbortController with a longer timeout for background fetches
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
      
      const response = await fetch(`/api/youtube/explore?category=${category}`, {
        next: { revalidate: 3600 },
        headers: {
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        if (data.videos && data.videos.length > 0) {
          // Process the videos to include view count formatting
          const processedVideos = data.videos.map((video: any) => {
            let viewCount = '0';
            if (video.statistics?.viewCount) {
              viewCount = video.statistics.viewCount;
            } else if (video.viewCount) {
              viewCount = video.viewCount;
            } else if (video.views) {
              viewCount = typeof video.views === 'number' ? String(video.views) : video.views;
            }
            
            // Now formatViewCount is defined before it's used
            return {
              ...video,
              views: formatViewCount(viewCount),
              viewCount: viewCount
            };
          });
          
          setCachedData(cacheKey, processedVideos);
          setCachedData(timestampKey, Date.now());
          console.log(`Updated ${category} cache with ${processedVideos.length} videos`);
          
          // If this is the current category, silently update the UI
          if (category === selectedCategory) {
            setVideos(prev => {
              // Only update if we have more videos than before
              return processedVideos.length > prev.length ? processedVideos : prev;
            });
          }
        }
      }
    } catch (error) {
      console.error(`Error prefetching ${category} data:`, error);
      // Don't alert the user about background prefetching errors
    }
  };

  // --- Handle Category Change ---
  const handleCategoryChange = (category: string) => {
    if (category === selectedCategory) return; // Do nothing if same category clicked
    
    console.log(`Changing category to: ${category}`);
    setSelectedCategory(category);
    
    // Check if we have cached videos for the category
    const videoCacheKey = getVideoCacheKey(category);
    const timestampKey = getTimestampCacheKey(category);
    
    const cachedTimestamp = getCachedData<number>(timestampKey);
    const cachedVideos = getCachedData<Video[]>(videoCacheKey);
    
    // Use cache if available and not expired
    if (cachedTimestamp && (Date.now() - cachedTimestamp < CACHE_DURATION) && 
        cachedVideos && Array.isArray(cachedVideos) && cachedVideos.length > 0) {
      console.log(`Loading videos for '${category}' from cache. ${cachedVideos.length} videos found.`);
      setVideos(cachedVideos);
      setLoading(false);
    } else {
      // If no valid cache, load from API
      loadCategoryVideos(category);
    }
    
    // Reset load more state for the new category
    setHasMore(true);
    setNextPageToken(null); 
    setNextQueryIndex(0);
  };

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

  // Optimize loading skeleton for faster initial render
  if (loading && initialFetch) {
    return (
      <div className="container mx-auto px-0 sm:px-4 py-4 sm:py-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6 px-2 sm:px-0">
          <h1 className="text-xl sm:text-2xl font-bold">Explore</h1>
          <div className="w-32 h-4 bg-gray-800 rounded animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <div key={i} className="flex flex-col sm:flex-row space-x-0 sm:space-x-4 p-2 sm:p-4 bg-gray-800/20 rounded-xl animate-pulse">
              <div className="w-full sm:w-[360px] aspect-video bg-gray-700 rounded-xl mb-2 sm:mb-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700/70 rounded w-1/3"></div>
                <div className="h-4 bg-gray-700/70 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Add new function to use lazy loading for video images
  function LazyImage({ src, alt, className }: { src: string, alt: string, className?: string }) {
    const [isVisible, setIsVisible] = useState(false);
    const imgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        {
          rootMargin: '200px',
          threshold: 0.01
        }
      );

      if (imgRef.current) {
        observer.observe(imgRef.current);
      }

      return () => {
        if (imgRef.current) {
          observer.unobserve(imgRef.current);
        }
      };
    }, []);

    return (
      <div ref={imgRef} className="relative aspect-video w-full overflow-hidden">
        {!isVisible && (
          <div className="absolute inset-0 bg-gray-700"></div>
        )}
        {isVisible && (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={className || "object-cover"}
            loading="lazy"
          />
        )}
      </div>
    );
  }

  // Modify RegularVideoCard to use LazyImage
  const RegularVideoCard = ({ video, onClick }: { video: Video; onClick?: () => void }) => {
    return (
      <div 
        className="flex flex-col p-2 sm:p-4 bg-black/20 hover:bg-black/40 rounded-xl transition-colors cursor-pointer space-y-3"
        onClick={onClick}
      >
        <div className="w-full overflow-hidden rounded-lg relative">
          {/* Replace Image with LazyImage */}
          <LazyImage 
            src={video.thumbnail || '/placeholder.jpg'} 
            alt={video.title} 
            className="object-cover transition-all duration-300 hover:scale-105"
          />
          {video.duration && (
            <div className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.5 rounded text-xs text-white">
              {video.duration}
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <h3 className="font-medium text-sm sm:text-base line-clamp-2">{video.title}</h3>
          <p className="text-xs text-muted-foreground">{video.uploader}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground/70" />
              {formatViewCount(video.viewCount || video.views)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground/70" />
              {formatDate(video.publishedAt || video.uploadDate)}
            </span>
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

  // Match the trending page loading indicator style
  if (loading && videos.length === 0) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-0 sm:px-4 py-4 sm:py-8">
      <div className="flex items-center justify-between mb-4 sm:mb-6 px-2 sm:px-0">
        <h1 className="text-xl sm:text-2xl font-bold">Explore</h1>
        <p className="text-sm text-muted-foreground hidden md:block">Discover new videos from India</p>
      </div>

      {/* Main Video List - Changed from grid to vertical list */}
      <div className="space-y-2 sm:space-y-6">
        {videos.map((video: Video, idx) => {
          if (!video || typeof video !== 'object' || !video.id) {
            console.warn('Skipping render for invalid video data in list:', video);
            return <div key={`invalid-${idx}`} />;
          }
          
          return (
            <div 
              key={`${video.id}-${idx}`}
              className="flex flex-col sm:flex-row space-x-0 sm:space-x-4 group cursor-pointer hover:bg-muted/50 rounded-xl p-2 sm:p-4 relative"
              onClick={() => handleVideoClick(video)}
            >
              <div className="relative w-full sm:w-[360px] aspect-video mb-2 sm:mb-0 flex-shrink-0">
                <Image
                  src={video.thumbnail || '/placeholder-video.jpg'}
                  alt={video.title || 'Video thumbnail'}
                  fill
                  className="rounded-xl object-cover"
                  sizes="(max-width: 640px) 100vw, 360px"
                  priority={idx < 2}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-video.jpg';
                  }}
                />
                {video.duration && (
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                    {video.duration}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0 px-2 sm:px-0">
                <div className="flex justify-between items-start">
                  <h3 className="text-base sm:text-lg font-semibold line-clamp-2 mb-1 sm:mb-2 group-hover:text-foreground/90 pr-8">
                    {video.title || 'Untitled Video'}
                  </h3>
                  <div className="absolute right-2 sm:right-4 top-2 sm:top-4 opacity-0 group-hover:opacity-100 transition-opacity">
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
                {(video.channelTitle || video.uploader) && (
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                    {video.channelTitle || video.uploader || 'Unknown Channel'}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground/70" />
                    {formatViewCount(video.viewCount || video.views)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground/70" />
                    {formatDate(video.publishedAt || video.uploadDate)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2 hidden sm:block">
                  {video.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More / Loading Indicator - Only show when actually loading more videos, not on initial load */}
      {!initialFetch && !loading && videos.length > 5 && hasMore && (
        <div ref={ref} className="flex justify-center items-center py-6 sm:py-8">
          {loadingMore ? (
            <div className="hidden items-center gap-2 text-sm sm:text-base">
              <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
              <span>Loading more videos...</span>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-sm sm:text-base opacity-0"
              aria-hidden="true"
            >
              Load More
            </Button>
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