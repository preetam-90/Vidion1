"use client"

import { useState, useEffect } from "react"
import { usePageTitle } from "@/hooks/usePageTitle"
import ImmersiveShortsPlayer from "@/components/immersive-shorts-player"
import { videos } from "@/data"
import { Loader2 } from "lucide-react"
import { getYouTubeShorts } from "@/lib/youtube-api"
import type { Video } from "@/data"

export default function ImmersiveShortsPage() {
  usePageTitle("Immersive Shorts")
  
  const [shortsVideos, setShortsVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [initialIndex, setInitialIndex] = useState(0)

  useEffect(() => {
    const fetchShorts = async () => {
      setLoading(true)
      setError(null)
      
      // Always prepare fallback videos in case API fails completely
      const fallbackVideos = videos
        .filter(video => video.isShort === true)
        .concat(
          videos
            .filter(video => !video.isShort)
            .slice(0, 10)
            .map(video => ({ ...video, isShort: true }))
        );
      
      try {
        // Try to fetch shorts from YouTube API - wrapped in try/catch to handle all API errors
        try {
          const ytShorts = await getYouTubeShorts()
          if (ytShorts && ytShorts.length > 0) {
            console.log('Successfully loaded YouTube shorts')
            setShortsVideos(ytShorts)
          } else {
            throw new Error('No YouTube shorts available')
          }
        } catch (apiError) {
          console.warn('Failed to fetch YouTube shorts, using local fallback:', apiError)
          
          // Use the fallback videos we prepared
          setShortsVideos(fallbackVideos)
        }
        
        // Check if we have a specific video ID to start with
        if (typeof window !== 'undefined') {
          const currentShortsId = sessionStorage.getItem('currentShortsId')
          if (currentShortsId) {
            // Find the index of the video with this ID
            const videoIndex = shortsVideos.findIndex(v => v.id === currentShortsId)
            if (videoIndex !== -1) {
              setInitialIndex(videoIndex)
            }
            // Clear the stored ID after using it
            sessionStorage.removeItem('currentShortsId')
          }
        }
      } catch (error) {
        console.error('Error in shorts processing:', error)
        setError('Failed to load shorts. Please try again later.')
        
        // Last resort fallback
        setShortsVideos(fallbackVideos)
        // Only show error if we couldn't even load fallback
        if (fallbackVideos.length > 0) {
          setError(null)
        }
      } finally {
        setLoading(false)
      }
    }
    
    fetchShorts()
  }, [])

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4 mx-auto" />
          <p className="text-white">Loading immersive shorts experience...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="text-center max-w-md p-6">
          <p className="text-red-400 text-lg mb-2">Error</p>
          <p className="text-white mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (shortsVideos.length === 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <p className="text-white">No shorts videos available</p>
      </div>
    )
  }

  return (
    <ImmersiveShortsPlayer 
      videos={shortsVideos}
      initialIndex={initialIndex}
      autoAdvance={true}
    />
  )
} 