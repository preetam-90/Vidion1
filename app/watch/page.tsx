"use client"

import VideoPlayer from "@/components/video-player"
import { useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"

interface Video {
  id: string;
  title: string;
  platform: 'youtube' | 'googleDrive';
  url?: string;
  channelTitle?: string;
  viewCount?: string;
  publishedAt?: string;
}

export default function WatchPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="aspect-video w-full bg-muted animate-pulse rounded-xl" />
        <div className="h-8 bg-muted animate-pulse rounded mt-4 w-3/4" />
      </div>
    }>
      <WatchPageContent />
    </Suspense>
  );
}

function WatchPageContent() {
  const searchParams = useSearchParams()
  const videoId = searchParams.get("v")
  const [video, setVideo] = useState<Video | null>(null)

  useEffect(() => {
    // Try to get video data from sessionStorage
    const storedVideo = sessionStorage.getItem('currentVideo')
    if (storedVideo) {
      try {
        const parsedVideo = JSON.parse(storedVideo)
        setVideo(parsedVideo)
        return
      } catch (error) {
        console.error('Error parsing stored video:', error)
      }
    }

    // Fallback if no stored video data
    if (videoId) {
      const fallbackVideo: Video = {
        id: videoId,
        title: "YouTube Video",
        platform: "youtube",
      }
      setVideo(fallbackVideo)
    }
  }, [videoId])

  if (!videoId) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-lg text-muted-foreground">No video ID provided</p>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="aspect-video w-full bg-muted animate-pulse rounded-xl" />
        <div className="h-8 bg-muted animate-pulse rounded mt-4 w-3/4" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <VideoPlayer video={video} />
      
      {/* Video Information */}
      <div className="mt-4">
        <h1 className="text-2xl font-bold">{video.title}</h1>
        <div className="flex items-center gap-2 mt-2 text-muted-foreground">
          {video.channelTitle && (
            <span className="font-medium">{video.channelTitle}</span>
          )}
          {video.viewCount && (
            <>
              <span>•</span>
              <span>{video.viewCount} views</span>
            </>
          )}
          {video.publishedAt && (
            <>
              <span>•</span>
              <span>{formatDate(video.publishedAt)}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function formatDate(dateString: string) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date string");
    }
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
    if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  } catch (e) {
    console.error("Error formatting date:", e);
    return 'Invalid date';
  }
} 