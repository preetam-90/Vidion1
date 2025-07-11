"use client"

import { useState, useCallback } from "react"
import { useRouter } from 'next/navigation'
import SharePopup from "@/components/share-popup"
import { InfiniteVideoGrid } from "@/components/video-grid"
import { Newspaper } from "lucide-react"
import type { Video } from '@/types/data';

// Helper function to format ISO 8601 duration to readable format
const formatDuration = (duration: string | undefined): string => {
  if (!duration) return "";
  
  // Parse the ISO 8601 duration format
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "";
  
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;
  
  // Format based on duration length
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
};

// Helper function for formatting view counts
const formatViewCount = (count: string | number | undefined): string => {
  if (!count) return '0 views'
  
  let numCount: number
  if (typeof count === 'string') {
    numCount = parseInt(count.replace(/[^0-9]/g, ''))
    if (isNaN(numCount)) return '0 views'
  } else {
    numCount = count
  }
  
  if (numCount >= 1000000) {
    return `${(numCount / 1000000).toFixed(1).replace(/\.0$/, '')}M views`
  } else if (numCount >= 1000) {
    return `${(numCount / 1000).toFixed(1).replace(/\.0$/, '')}K views`
  } else {
    return `${numCount} views`
  }
}

// Helper function for formatting dates
const formatPublishedDate = (dateString: string | undefined): string => {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 1) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
  } catch (e) {
    return ''
  }
}

export default function NewsPage() {
  const router = useRouter()
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const regionCode = "IN" // Explicitly set to India

  // Function to fetch news videos
  const fetchNewsVideos = useCallback(async (pageToken?: string) => {
    try {
      // Add region=IN to get Indian content and videoCategoryId=25 for news
      const response = await fetch(`/api/youtube/trending?region=${regionCode}&videoCategoryId=25${pageToken ? `&pageToken=${pageToken}` : ''}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch news videos')
      }
      
      const data = await response.json()

      if (!data.items || data.items.length === 0) {
        return { items: [], nextPageToken: null }
      }
      
      const formattedVideos = data.items.map((item: any) => ({
        id: item.id,
        title: item.title || item.snippet?.title || 'Untitled Video',
        thumbnail: item.thumbnail || (item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || '/placeholder-thumbnail.jpg'),
        uploader: item.channelTitle || item.snippet?.channelTitle || 'Unknown Channel',
        views: item.viewCount || item.statistics?.viewCount || '0',
        uploadDate: item.publishedAt || item.snippet?.publishedAt,
        description: item.snippet?.description || '',
        platform: 'youtube',
        category: 'news',
        likes: item.statistics?.likeCount || '0',
        comments: item.statistics?.commentCount || '0',
        url: `https://www.youtube.com/watch?v=${item.id}`,
        duration: item.duration || formatDuration(item.contentDetails?.duration),
      }))
      
      return {
        items: formattedVideos,
        nextPageToken: data.nextPageToken || null
      }
    } catch (err) {
      console.error("Error fetching news videos:", err)
      return { items: [], nextPageToken: null }
    }
  }, [regionCode])

  const handleShare = (video: Video) => {
    setSelectedVideo(video)
    setIsShareOpen(true)
  }

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

  return (
    <div className="container mx-auto px-0 sm:px-4 py-4 sm:py-8">
      <div className="flex items-center justify-between mb-4 sm:mb-6 px-2 sm:px-0">
        <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <Newspaper className="h-6 w-6" />
          News Videos
        </h1>
      </div>
      
      <InfiniteVideoGrid fetchVideos={fetchNewsVideos} batchSize={12} />
      
      {isShareOpen && selectedVideo && (
        <SharePopup
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          url={selectedVideo.url || `https://youtube.com/watch?v=${selectedVideo.id}`}
          title={selectedVideo.title}
        />
      )}
    </div>
  )
} 