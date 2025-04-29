"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { videos } from "../../../data"
import { notFound } from "next/navigation"
import VideoPlayer from "@/components/video-player"
import VideoInfo from "@/components/video-info"
import CommentSection from "@/components/comment-section"
import RecommendedVideos from "@/components/recommended-videos"
import { getVideoDetails, getRelatedVideos, convertYouTubeVideoToVideo } from "@/lib/youtube-api"
import type { Video } from "@/data"
import { usePageTitle } from "@/hooks/usePageTitle"

export default function VideoPage() {
  const params = useParams()
  const videoId = params.id as string

  const [video, setVideo] = useState<Video | null>(null)
  const [recommendedVideos, setRecommendedVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  // Set page title based on video title
  usePageTitle(video?.title)

  useEffect(() => {
    const fetchVideoData = async () => {
      setLoading(true)

      // Clean the video ID - remove any 'local-' prefix and handle YouTube URLs
      const cleanVideoId = videoId
        .replace('local-', '')
        .replace('watch?v=', '')
        .split('&')[0]; // Remove any additional parameters

      try {
        // First try to fetch from YouTube API
        const ytVideo = await getVideoDetails(cleanVideoId).catch(error => {
          console.warn('YouTube API error:', error);
          return null;
        });
        
        if (ytVideo) {
          const videoData = convertYouTubeVideoToVideo(ytVideo)
          setVideo(videoData)

          // Get related videos
          try {
            const relatedVideosData = await getRelatedVideos(cleanVideoId)
              .catch(error => {
                console.warn('Failed to fetch related videos:', error);
                return [];
              });
              
            if (relatedVideosData.length > 0) {
              const convertedRelated = relatedVideosData.map(convertYouTubeVideoToVideo)
              setRecommendedVideos(convertedRelated)
            } else {
              throw new Error('No related videos found');
            }
          } catch (error) {
            // If related videos fail, use random local videos
            console.warn('Using local recommendations instead:', error)
            const localRecommended = videos
              .sort(() => 0.5 - Math.random())
              .slice(0, 8)
            setRecommendedVideos(localRecommended)
          }
        } else {
          throw new Error('Video not found')
        }
      } catch (error) {
        console.warn('Failed to fetch from YouTube API, trying local videos:', error)
        
        // Try to find a local video
        const localVideo = videos.find((v) => v.id.toString() === cleanVideoId)
        if (localVideo) {
          setVideo(localVideo)

          // Get random videos for recommendations
          const localRecommended = videos
            .filter((v) => v.id.toString() !== cleanVideoId)
            .sort(() => 0.5 - Math.random())
            .slice(0, 8)

          setRecommendedVideos(localRecommended)
        } else {
          // If no local video found, use the first local video as fallback
          console.warn('Video not found locally, using fallback video')
          const fallbackVideo = videos[0]
          if (fallbackVideo) {
            setVideo(fallbackVideo)
            
            // Get random videos for recommendations
            const localRecommended = videos
              .filter((v) => v.id !== fallbackVideo.id)
              .sort(() => 0.5 - Math.random())
              .slice(0, 8)

            setRecommendedVideos(localRecommended)
          } else {
            console.error('No videos available as fallback');
            return notFound()
          }
        }
      } finally {
        setLoading(false)
      }
    }

    fetchVideoData().catch(error => {
      console.error('Unhandled error in fetchVideoData:', error);
      setLoading(false);
    });
  }, [videoId])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse">
          <div className="aspect-video bg-muted rounded-lg mb-4"></div>
          <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/3"></div>
        </div>
      </div>
    )
  }

  if (!video) {
    return notFound()
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VideoPlayer video={video} />
          <VideoInfo video={video} />
          <CommentSection videoId={video.id.toString()} />
        </div>
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Recommended Videos</h2>
          <RecommendedVideos videos={recommendedVideos} />
        </div>
      </div>
    </div>
  )
}
