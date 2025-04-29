"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from 'next/image'
import { formatDistanceToNowStrict } from 'date-fns'
import { Eye, MoreVertical, Share, Clock, Flag } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import SharePopup from "@/components/share-popup"
import { Loader2 } from "lucide-react"
import type { Video as AppVideo } from '@/types/data'; // Use the main Video type

// Use the main Video type for consistency
interface Video extends AppVideo {}

export default function TrendingPage() {
  const router = useRouter()
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [nextPageToken, setNextPageToken] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const lastVideoRef = useRef<HTMLDivElement | null>(null)
  const [loadingMore, setLoadingMore] = useState(false)
  const regionCode = "IN" // Explicitly set to India

  const loadMoreVideos = useCallback(async () => {
    if (loadingMore || (!nextPageToken && videos.length > 0 && hasMore)) return
    
    if (!hasMore) return

    try {
      if (videos.length === 0) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      const response = await fetch(`/api/youtube/trending?region=IN${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`)
      
      if (!response.ok) {
        let errorMsg = 'Failed to fetch trending videos';
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
          console.error("API Error Details:", errorData.details || "No additional details");
        } catch (parseError) {
          // Ignore parsing error, use default message
        }
        console.error("Initial API Error:", errorMsg);
        setHasMore(false);
        if (videos.length > 0) {
          setLoading(false);
          setLoadingMore(false);
          return;
        }
        
        throw new Error(errorMsg);
      }
      
      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        setHasMore(false)
      } else {
        setVideos(prev => {
          const existingIds = new Set(prev.map(v => v.id))
          const uniqueNewVideos = data.items.map((item: any) => ({
            id: item.id,
            title: item.title || item.snippet.title,
            thumbnail: item.thumbnail || (item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url),
            uploader: item.channelTitle || item.snippet.channelTitle,
            views: formatViewCount(item.viewCount || item.statistics?.viewCount),
            uploadDate: item.publishedAt || item.snippet.publishedAt,
            description: item.snippet.description,
            platform: 'youtube',
            category: 'trending',
            likes: formatViewCount(item.statistics?.likeCount),
            comments: formatViewCount(item.statistics?.commentCount),
            url: `https://www.youtube.com/watch?v=${item.id}`,
            duration: item.duration || item.contentDetails?.duration,
          })).filter((video: Video) => !existingIds.has(video.id))
          
          if (uniqueNewVideos.length === 0) {
            setHasMore(false)
            return prev
          }
          
          return [...prev, ...uniqueNewVideos]
        })
        setNextPageToken(data.nextPageToken || null)
      }
    } catch (err) {
      console.error("Error loading videos:", err);
      setHasMore(false);
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [nextPageToken, videos.length, loadingMore, hasMore])

  // Initialize intersection observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          loadMoreVideos()
        }
      },
      { threshold: 0.1 }
    )
  }, [hasMore, loading, loadMoreVideos, loadingMore])

  // Observe last video element
  useEffect(() => {
    const currentObserver = observerRef.current
    const lastElement = lastVideoRef.current

    if (currentObserver && lastElement) {
      currentObserver.observe(lastElement)
    }

    return () => {
      if (currentObserver && lastElement) {
        currentObserver.unobserve(lastElement)
      }
    }
  }, [videos])

  // Initial load
  useEffect(() => {
    setVideos([]);
    setNextPageToken(null);
    setHasMore(true);
    setLoading(true);
    loadMoreVideos();
  }, []);

  const handleVideoClick = (video: Video) => {
    sessionStorage.setItem('currentVideo', JSON.stringify({
      id: video.id,
      title: video.title,
      platform: 'youtube',
      thumbnailUrl: video.thumbnail,
      viewCount: typeof video.views === 'string' ? parseInt(video.views.replace(/[^0-9]/g, '')) : video.views,
      publishedAt: video.uploadDate
    }))
    router.push(`/video/${video.id}`)
  }

  const handleShare = (video: Video, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedVideo(video)
    setIsShareOpen(true)
  }

  const handleReport = (video: Video, e: React.MouseEvent) => {
    e.stopPropagation()
    toast.success("Thank you for reporting this video")
  }

  if (loading && videos.length === 0) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Trending in India</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Flag className="w-4 h-4" />
            India
          </span>
        </div>
      </div>
      {videos.length > 0 ? (
        <div className="space-y-6">
          {videos.map((video, index) => (
            <div 
              key={video.id} 
              ref={index === videos.length - 1 ? lastVideoRef : null}
              className="flex flex-col sm:flex-row space-x-0 sm:space-x-4 group cursor-pointer hover:bg-muted/50 rounded-xl p-4 relative"
              onClick={() => handleVideoClick(video)}
            >
              <div className="relative w-full sm:w-[360px] aspect-video mb-2 sm:mb-0 flex-shrink-0">
                <Image
                  src={video.thumbnail || '/placeholder-thumbnail.jpg'}
                  alt={video.title || 'Video thumbnail'}
                  fill
                  className="rounded-xl object-cover"
                  sizes="(max-width: 640px) 100vw, 360px"
                  priority={index < 2}
                />
                {video.duration && (
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                    {video.duration}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold line-clamp-2 mb-2 group-hover:text-foreground/90 pr-8">
                    {video.title || 'Untitled Video'}
                  </h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem onClick={(e) => handleShare(video, e)}>
                        <Share className="mr-2 h-4 w-4" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={(e) => handleReport(video, e)}>
                        <Flag className="mr-2 h-4 w-4" />
                        Report
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {video.uploader && (
                  <p className="text-sm text-muted-foreground mb-1">
                    {video.uploader}
                  </p>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {video.views && (
                    <>
                      <span>{video.views}</span>
                      <span>•</span>
                    </>
                  )}
                  {video.uploadDate && (
                    <span>{formatPublishedDate(video.uploadDate)}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          No trending videos available
        </div>
      )}

      {loadingMore && (
        <div className="flex justify-center items-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {isShareOpen && selectedVideo && (
        <SharePopup
          isOpen={isShareOpen}
          url={selectedVideo.url}
          title={selectedVideo.title}
          onClose={() => setIsShareOpen(false)}
        />
      )}
    </div>
  )
}

// Helper function for formatting view counts with safe handling
const formatViewCount = (count: string | number | undefined): string => {
  if (count === undefined) return "0 views"
  const numCount = typeof count === "string" ? parseInt(count) : count
  if (isNaN(numCount)) return "0 views"
  
  try {
    if (numCount >= 1_000_000_000) {
      return (numCount / 1_000_000_000).toFixed(1).replace(".0", "") + "B views"
    }
    if (numCount >= 1_000_000) {
      return (numCount / 1_000_000).toFixed(1).replace(".0", "") + "M views"
    }
    if (numCount >= 1_000) {
      return (numCount / 1_000).toFixed(1).replace(".0", "") + "K views"
    }
    return numCount.toString() + " views"
  } catch (error) {
    console.error("Error formatting view count:", error)
    return "0 views"
  }
}

// Helper function for safe date formatting
const formatPublishedDate = (dateString: string | undefined): string => {
  if (!dateString) return ""
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return ""
    }
    return formatDistanceToNowStrict(date) + " ago"
  } catch (error) {
    console.error("Error formatting date:", error)
    return ""
  }
}