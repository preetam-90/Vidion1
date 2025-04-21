"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from "lucide-react"

interface VideoPlayerProps {
  video: {
    id: string | number
    title: string
    url: string
    platform: string
    thumbnail?: string
  }
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle video URL based on platform
  const getVideoSource = () => {
    switch (video.platform.toLowerCase()) {
      case 'youtube':
        // Ensure URL is embed format
        if (video.url.includes('youtube.com/watch?v=')) {
          const videoId = video.url.split('v=')[1].split('&')[0]
          return `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`
        }
        return video.url
      case 'googledrive':
        // Ensure URL is in embed/preview format
        if (video.url.includes('drive.google.com/file/d/')) {
          // Handle both formats:
          // https://drive.google.com/file/d/FILE_ID/view
          // https://drive.google.com/file/d/FILE_ID/preview
          const pattern = /\/d\/([^\/]+)/
          const match = video.url.match(pattern)
          if (match && match[1]) {
            return `https://drive.google.com/file/d/${match[1]}/preview`
          }
        }
        return video.url
      default:
        return video.url
    }
  }

  // Check if using iframe or direct video
  const isIframe = ['youtube', 'googledrive', 'vimeo', 'dailymotion', 'bitchute', 'odysee'].includes(video.platform.toLowerCase())

  // Format time (seconds to MM:SS)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`
  }

  // Video control handlers
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime
      const duration = videoRef.current.duration
      setCurrentTime(currentTime)
      setProgress((currentTime / duration) * 100)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newTime = (parseInt(e.target.value) / 100) * videoRef.current.duration
      videoRef.current.currentTime = newTime
      setProgress(parseInt(e.target.value))
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  useEffect(() => {
    if (videoRef.current) {
      // Add event listeners
      videoRef.current.addEventListener('timeupdate', handleTimeUpdate)
      videoRef.current.addEventListener('loadedmetadata', () => {
        setDuration(videoRef.current?.duration || 0)
      })
      videoRef.current.addEventListener('play', () => setIsPlaying(true))
      videoRef.current.addEventListener('pause', () => setIsPlaying(false))
    }

    return () => {
      if (videoRef.current) {
        // Remove event listeners
        videoRef.current.removeEventListener('timeupdate', handleTimeUpdate)
        videoRef.current.removeEventListener('loadedmetadata', () => {})
        videoRef.current.removeEventListener('play', () => {})
        videoRef.current.removeEventListener('pause', () => {})
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="relative rounded-lg overflow-hidden mb-4 bg-black">
      {isIframe ? (
        // Iframe for platforms like YouTube, Google Drive
        <iframe
          src={getVideoSource()}
          title={video.title}
          frameBorder="0"
          allowFullScreen
          className="w-full aspect-video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      ) : (
        // Direct video element for local videos or direct URLs
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full aspect-video"
            src={video.url}
            poster={video.thumbnail}
            onClick={togglePlay}
            controls={false}
          />
          
          {/* Custom controls (only shown for direct video, not iframes) */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            {/* Progress bar */}
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="w-full h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #ef4444 ${progress}%, rgba(255,255,255,0.2) ${progress}%)`,
              }}
            />
            
            {/* Controls row */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <button onClick={togglePlay} className="text-white p-1 rounded-full hover:bg-white/20">
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button onClick={toggleMute} className="text-white p-1 rounded-full hover:bg-white/20">
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              
              <div>
                <button onClick={toggleFullscreen} className="text-white p-1 rounded-full hover:bg-white/20">
                  <Maximize size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 