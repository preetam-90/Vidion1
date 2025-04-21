"use client"

import { useCallback, useState } from "react"
import { ThumbsUp, MessageSquare, Share, Clock, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWatchLater } from "@/contexts/watch-later-context"
import { useToast } from "@/components/ui/use-toast"
import SharePopup from "@/components/share-popup"

interface VideoInfoProps {
  video: {
    id: string | number
    title: string
    uploader: string
    views: number | string
    likes: number | string
    description: string
    comments: number | string
    uploadDate: string
  }
}

export default function VideoInfo({ video }: VideoInfoProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const { addToWatchLater, removeFromWatchLater, isInWatchLater } = useWatchLater()
  const { toast } = useToast()

  const toggleDescription = useCallback(() => {
    setIsDescriptionExpanded((prev) => !prev)
  }, [])

  const handleWatchLater = useCallback(() => {
    if (isInWatchLater(video.id.toString())) {
      removeFromWatchLater(video.id.toString())
      toast({
        description: "Removed from Watch Later",
        duration: 2000,
      })
    } else {
      // Add to watch later with required properties
      addToWatchLater({
        id: video.id.toString(),
        title: video.title,
        uploader: video.uploader,
        views: typeof video.views === 'string' ? parseInt(video.views.replace(/[^0-9]/g, '')) : video.views,
        likes: typeof video.likes === 'string' ? parseInt(video.likes.replace(/[^0-9]/g, '')) : video.likes,
        comments: typeof video.comments === 'string' ? parseInt(video.comments.replace(/[^0-9]/g, '')) : video.comments,
        uploadDate: video.uploadDate,
        description: video.description,
        // These are commonly required in the watch later context
        thumbnail: "", // Fill with default or require in props
        url: "",      // Fill with default or require in props
        platform: "youtube", // Default platform
        category: "video", // Default category
      })
      toast({
        description: "Added to Watch Later",
        duration: 2000,
      })
    }
  }, [video, addToWatchLater, removeFromWatchLater, isInWatchLater, toast])

  const formatNumber = (num: number | string): string => {
    const parsedNum = typeof num === 'string' ? parseInt(num.replace(/[^0-9]/g, '')) : num
    
    if (isNaN(parsedNum)) return '0'
    
    if (parsedNum >= 1000000) {
      return `${(parsedNum / 1000000).toFixed(1).replace(/\.0$/, '')}M`
    }
    if (parsedNum >= 1000) {
      return `${(parsedNum / 1000).toFixed(1).replace(/\.0$/, '')}K`
    }
    return parsedNum.toString()
  }

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
      
      <div className="flex flex-col sm:flex-row justify-between mb-4 sm:items-center gap-4">
        <div>
          <p className="font-medium">{video.uploader}</p>
          <p className="text-muted-foreground text-sm">
            {formatNumber(video.views)} views • {video.uploadDate}
          </p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" className="gap-1">
            <ThumbsUp className="h-4 w-4" />
            {formatNumber(video.likes)}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => setIsShareOpen(true)}
          >
            <Share className="h-4 w-4" />
            Share
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={handleWatchLater}
          >
            <Clock className="h-4 w-4" />
            {isInWatchLater(video.id.toString()) ? "Remove" : "Save"}
          </Button>
          
          <Button variant="outline" size="sm" className="gap-1">
            <Flag className="h-4 w-4" />
            Report
          </Button>
        </div>
      </div>
      
      <div className="bg-muted rounded-lg p-4">
        <div
          className={`${
            isDescriptionExpanded ? "" : "line-clamp-3"
          } text-sm whitespace-pre-line`}
        >
          {video.description}
        </div>
        {video.description.length > 150 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDescription}
            className="mt-2"
          >
            {isDescriptionExpanded ? "Show less" : "Show more"}
          </Button>
        )}
      </div>

      {/* Share Popup */}
      <SharePopup
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        url={`${typeof window !== 'undefined' ? window.location.origin : ''}/video/${video.id}`}
        title={video.title}
      />
    </div>
  )
} 