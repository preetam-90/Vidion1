"use client"

import VideoPlayer from "@/components/video-player"
import { useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense, useCallback } from "react"
import LikeButton from "@/components/like-button"
import { ArrowLeft, ThumbsUp, Share, Flag } from "lucide-react"
import Link from "next/link"
import WatchRecommendedVideos from "@/components/watch-recommended-videos"
import { Button } from "@/components/ui/button"
import { getRelatedVideos, convertYouTubeVideoToVideo } from "@/lib/youtube-api"
import { videos as demoVideos } from "@/data"

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
      <div className="w-full max-w-[1480px] mx-auto p-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="lg:col-span-2">
            <div className="w-full aspect-video bg-muted animate-pulse rounded-lg" />
            <div className="h-8 bg-muted animate-pulse mt-4 w-3/4 mx-4" />
          </div>
          <div className="hidden lg:block">
            <div className="h-8 bg-muted animate-pulse w-2/3 mb-4" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-2 mb-3">
                <div className="w-[140px] h-[80px] bg-muted animate-pulse rounded-lg" />
                <div className="flex-1">
                  <div className="h-4 bg-muted animate-pulse w-full mb-1" />
                  <div className="h-3 bg-muted animate-pulse w-2/3 mb-1" />
                  <div className="h-3 bg-muted animate-pulse w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
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
  const [recommendedVideos, setRecommendedVideos] = useState<any[]>([])

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

  // Fetch recommended videos
  useEffect(() => {
    const fetchRecommendedVideos = async () => {
      if (!videoId) return;
      
      try {
        // Try to fetch from YouTube API
        const ytVideos = await getRelatedVideos(videoId, 15).catch(() => []);
        
        if (ytVideos && ytVideos.length > 0) {
          const processedVideos = ytVideos.map(convertYouTubeVideoToVideo);
          setRecommendedVideos(processedVideos);
        } else {
          // Fallback to demo videos
          const randomVideos = [...demoVideos]
            .sort(() => 0.5 - Math.random())
            .slice(0, 15);
          setRecommendedVideos(randomVideos);
        }
      } catch (error) {
        console.error('Error fetching recommended videos:', error);
        // Fallback to demo videos on error
        const randomVideos = [...demoVideos]
          .sort(() => 0.5 - Math.random())
          .slice(0, 15);
        setRecommendedVideos(randomVideos);
      }
    };

    fetchRecommendedVideos();
  }, [videoId]);

  if (!videoId) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-lg text-muted-foreground">No video ID provided</p>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="w-full max-w-[1480px] mx-auto p-0 sm:px-4">
        <div className="w-full aspect-video bg-muted animate-pulse rounded-lg" />
        <div className="h-8 bg-muted animate-pulse mt-4 w-3/4 mx-4" />
      </div>
    )
  }

  return (
    <div className="watch-page w-full px-4 sm:px-6">
      {/* Navigation back */}
      <div className="flex items-center my-3">
        <Link href="/" className="inline-flex items-center gap-1 text-sm hover:underline mr-2">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2">
          {/* Player */}
          {video && video.url ? (
            <VideoPlayer video={video as Video & { url: string }} />
          ) : (
            // Show a placeholder or loading state if URL is missing but video ID exists
            <div className="w-full aspect-video bg-muted flex items-center justify-center rounded-lg">
              <p className="text-muted-foreground">
                {video ? 'Loading player...' : 'Loading video details...'} 
              </p> 
            </div>
          )}
          
          {/* Video Information */}
          {video && (
            <div className="mt-4">
              <h1 className="text-2xl font-bold">{video.title}</h1>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 gap-4">
                {/* Metadata */}
                <div className="flex items-center gap-2 text-muted-foreground flex-wrap">
                  {video.channelTitle && (
                    <span className="font-medium">{video.channelTitle}</span>
                  )}
                  {video.viewCount && (
                    <>
                      <span>•</span>
                      <span>{video.viewCount}</span>
                    </>
                  )}
                  {video.publishedAt && (
                    <>
                      <span>•</span>
                      <span>{formatDate(video.publishedAt)}</span>
                    </>
                  )}
                </div>
                
                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="rounded-full">
                    <ThumbsUp size={16} className="mr-2" />
                    Like
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full">
                    <Share size={16} className="mr-2" />
                    Share
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full">
                    <Flag size={16} className="mr-2" />
                    Report
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Recommended Videos Sidebar */}
        <div className="lg:block">
          {recommendedVideos.length > 0 ? (
            <WatchRecommendedVideos videos={recommendedVideos} />
          ) : (
            <div className="space-y-2">
              <h3 className="text-md font-medium mb-3">Recommended videos</h3>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-2 mb-3">
                  <div className="w-[140px] h-[80px] bg-muted animate-pulse rounded-lg" />
                  <div className="flex-1">
                    <div className="h-4 bg-muted animate-pulse w-full mb-1" />
                    <div className="h-3 bg-muted animate-pulse w-2/3 mb-1" />
                    <div className="h-3 bg-muted animate-pulse w-1/3" />
                  </div>
                </div>
              ))}
            </div>
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