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
import { videos as fallbackVideos } from '@/data' // Import local fallback data

interface Video {
  id: string
  title: string
  thumbnail: string
  channelTitle: string
  publishedAt: string
  viewCount: string
  duration: string
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

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  })

  // Function to build API URL
  const buildApiUrl = (token: string | null, queryIndex: number) => {
    const params = new URLSearchParams()
    if (token) {
      params.append('pageToken', token)
    }
    params.append('queryIndex', String(queryIndex))
    return `/api/youtube/home?${params.toString()}`
  }

  // Function to check API status
  const checkApiStatus = async () => {
    try {
      const response = await fetch('/api/youtube/status')
      if (response.ok) {
        const data = await response.json()
        if (data && data.keyStatus) {
          setApiStatus({
            activeKeys: data.keyStatus.activeKeys,
            totalKeys: data.keyStatus.totalKeys,
            quotaReset: data.quotaResetInfo
          })
          
          console.log("API Status:", data.keyStatus)
          
          // If no active keys, automatically use fallback
          if (data.keyStatus.activeKeys === 0) {
            useFallbackData('All YouTube API keys have reached their quota limits. Using cached videos instead.')
            return false
          }
        }
        return true
      }
    } catch (err) {
      console.error("Error checking API status:", err)
    }
    return true // Default to trying the API if status check fails
  }

  // Fetch random videos from different categories for 'New to You' section
  const fetchNewToYouVideos = async () => {
    try {
      setLoadingNewToYou(true)
      
      // Get random categories (e.g., music, gaming, news, etc.)
      const categories = ['music', 'gaming', 'news', 'movies', 'education']
      const randomCategory = categories[Math.floor(Math.random() * categories.length)]
      
      // Fetch videos from the random category
      const response = await fetch(`/api/youtube/search?q=${randomCategory}&maxResults=5`)
      if (!response.ok) throw new Error('Failed to fetch new videos')
      
      const data = await response.json()
      setNewToYouVideos(data.videos || [])
    } catch (err) {
      console.error('Error fetching new to you videos:', err)
      // Use fallback data if API fails
      const fallbackVideos = localVideos
        .filter(v => v.category === randomCategory)
        .slice(0, 5)
      setNewToYouVideos(fallbackVideos)
    } finally {
      setLoadingNewToYou(false)
    }
  }

  const fetchInitialVideos = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Fetching initial videos for explore page...')
      
      // Use fallback data immediately
      useFallbackData('Displaying videos from local data.')
      
      // Also fetch initial 'New to You' videos
      await fetchNewToYouVideos()
      
      setLoading(false)
      setInitialFetch(false)
    } catch (err) {
      console.error('Failed to fetch videos:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to load videos. Please try again later.'
      
      useFallbackData(errorMessage)
    } finally {
      setLoading(false)
      setInitialFetch(false)
    }
  }

  // Helper function to use fallback data
  const useFallbackData = (errorMessage = '') => {
    // Use local fallback data when API fails
    console.log('Using fallback video data')
    const formattedFallbackVideos = fallbackVideos.slice(0, 20).map(video => ({
      id: video.id,
      title: video.title,
      thumbnail: video.thumbnail,
      channelTitle: video.channelTitle,
      publishedAt: video.publishedAt,
      viewCount: video.viewCount || '1K',
      duration: video.duration || '3:45',
    }));
    
    setVideos(formattedFallbackVideos)
    setHasMore(false) // Don't attempt to load more with fallback data
    
    if (errorMessage) {
      setError(errorMessage)
    }
  }

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

  // Initial fetch on mount
  useEffect(() => {
    fetchInitialVideos()
  }, [])

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

  const RegularVideoCard = ({ video, index }: { video: Video, index: number }) => (
    <div 
      className="group relative cursor-pointer rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg"
      onClick={() => handleVideoClick(video)}
    >
      <div className="aspect-video relative overflow-hidden rounded-xl bg-muted">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-video.jpg';
          }}
        />
        <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1 py-0.5 text-xs text-white">
          {video.duration}
        </div>
      </div>
      
      <div className="p-2">
        <div className="flex gap-2 items-start">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium line-clamp-2 text-base group-hover:text-primary">
              {video.title}
            </h3>
            <div className="flex flex-col text-sm text-muted-foreground mt-1">
              <span className="truncate">{video.channelTitle}</span>
              <div className="flex items-center gap-1">
                <span>{video.viewCount} views</span>
                <span>•</span>
                <span>{formatDate(video.publishedAt)}</span>
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

  const handleVideoClick = (video: Video) => {
    try {
      // Clean the video ID in case it has any URL parameters
      const cleanId = video.id.split('?')[0];
      
      // Navigate to the video page
      router.push(`/player?v=${cleanId}`)
        .catch(err => {
          console.error('Navigation error:', err);
          // Fallback to direct navigation if router fails
          window.location.href = `/player?v=${cleanId}`;
        });
    } catch (error) {
      console.error('Error handling video click:', error);
      toast({
        title: "Error",
        description: "Could not play this video. Please try again.",
      });
    }
  }

  // Add a fallback component to display when YouTube API fails
  const FallbackExploreContent = () => {
    // Determine if the error is quota-related
    const isQuotaError = error?.toLowerCase().includes('quota') || error?.toLowerCase().includes('exceeded')
    
    return (
      <div className="flex flex-col gap-6 pb-10 container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold mt-6">Explore</h1>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">
            {isQuotaError ? 'YouTube API Quota Limit' : 'YouTube API Issues'}
          </h3>
          <p className="text-yellow-700">
            {error || "We're experiencing issues with the YouTube API. Please try again later."}
          </p>
          <p className="text-yellow-700 mt-2">
            Showing fallback videos from our local database.
          </p>
          {isQuotaError && (
            <p className="text-yellow-700 mt-2 text-sm">
              <strong>Note:</strong> YouTube API has strict daily limits that reset after 24 hours.
              {apiStatus && (
                <span className="block mt-1">
                  API Status: {apiStatus.activeKeys} of {apiStatus.totalKeys} keys available.
                  {apiStatus.quotaReset && ` Quotas typically reset ${apiStatus.quotaReset}.`}
                </span>
              )}
            </p>
          )}
          <Button 
            className="mt-4" 
            variant="outline"
            onClick={handleRetry}
            disabled={apiStatus?.activeKeys === 0}
          >
            {apiStatus?.activeKeys === 0 ? 'API Quota Exceeded' : 'Retry with YouTube'}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {videos.map((video, index) => (
            <RegularVideoCard key={video.id} video={video} index={index} />
          ))}
        </div>
      </div>
    )
  }

  // Render error state with retry button and fallback content
  if (error && videos.length > 0) {
    return <FallbackExploreContent />
  } else if (error) {
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
    <div className="flex flex-col gap-6 pb-20 container mx-auto px-4 md:px-6">
      <div className="mt-6">
        <h1 className="text-3xl font-bold">Explore</h1>
        <p className="text-muted-foreground mt-1">Discover new videos from India</p>
      </div>

      {/* New to You Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">New to You</h2>
          <button 
            onClick={fetchNewToYouVideos}
            className="text-sm text-blue-500 hover:text-blue-700"
            disabled={loadingNewToYou}
          >
            {loadingNewToYou ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        
        {loadingNewToYou ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} className="aspect-video rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {newToYouVideos.map(video => (
              <VideoCard 
                key={video.id}
                video={video}
                onClick={() => router.push(`/watch?v=${video.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Main Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {videos.map((video, index) => (
          <RegularVideoCard key={video.id} video={video} index={index} />
        ))}
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
      
      <ReportDialog isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />
      <FeedbackDialog isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
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