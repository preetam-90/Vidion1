"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { MoreVertical, Share, Clock, Flag, Ban, Trash2, ThumbsUp } from "lucide-react"
import type { Video } from "@/data"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import SharePopup from "./share-popup"
import { useWatchLater } from "@/contexts/watch-later-context"
import { ReportDialog } from "./report-dialog"
import { FeedbackDialog } from "./feedback-dialog"
import { useToast } from "@/components/ui/use-toast"
import { useLikedVideos } from "@/contexts/liked-videos-context"
import Image from "next/image"
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver"

interface VideoCardProps {
  video: Video
  layout?: "grid" | "list"
  context?: 'history' | 'favorites' | string;
  onRemoveFromHistory?: (videoId: string | number) => void;
  onClick?: () => void;
}

export default function VideoCard({ video, layout = "grid", context, onRemoveFromHistory }: VideoCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isJustHidden, setIsJustHidden] = useState(false)
  const [isReported, setIsReported] = useState(false)
  const [isJustReported, setIsJustReported] = useState(false)
  const { addToWatchLater, removeFromWatchLater, isInWatchLater } = useWatchLater()
  const { isLiked, removeFromLiked, addToLiked } = useLikedVideos()
  const { toast } = useToast()

  useEffect(() => {
    try {
      const hiddenVideos = JSON.parse(localStorage.getItem("hiddenVideos") || "[]") as string[]
      const reportedVideos = JSON.parse(localStorage.getItem("reportedVideos") || "[]") as string[]
      setIsHidden(hiddenVideos.includes(String(video?.id || '')))
      setIsReported(reportedVideos.includes(String(video?.id || '')))
    } catch (error) {
      console.error('Error checking video status:', error)
    }
  }, [video?.id])

  const handleWatchLater = () => {
    if (!video) return
    if (isInWatchLater(video.id)) {
      removeFromWatchLater(video.id)
    } else {
      addToWatchLater(video)
    }
  }

  const handleNotInterested = () => {
    if (!video?.id) return
    try {
      const hiddenVideos = JSON.parse(localStorage.getItem("hiddenVideos") || "[]") as string[]
      hiddenVideos.push(String(video.id))
      localStorage.setItem("hiddenVideos", JSON.stringify(hiddenVideos))
      setIsHidden(true)
      setIsJustHidden(true)
    } catch (error) {
      console.error('Error handling not interested:', error)
    }
  }

  const handleUndo = () => {
    if (!video?.id) return
    try {
      const hiddenVideos = JSON.parse(localStorage.getItem("hiddenVideos") || "[]") as string[]
      const index = hiddenVideos.indexOf(String(video.id))
      if (index > -1) {
        hiddenVideos.splice(index, 1)
        localStorage.setItem("hiddenVideos", JSON.stringify(hiddenVideos))
      }
      setIsHidden(false)
      setIsJustHidden(false)
    } catch (error) {
      console.error('Error handling undo:', error)
    }
  }

  const handleFeedbackSubmit = (reason: string) => {
    if (!video?.id) return
    console.log(`Feedback submitted for video ${video.id}: ${reason}`)
    setIsJustHidden(false)
  }

  const handleReport = (reason: string) => {
    if (!video?.id) return
    try {
      const reportedVideos = JSON.parse(localStorage.getItem("reportedVideos") || "[]") as string[]
      reportedVideos.push(String(video.id))
      localStorage.setItem("reportedVideos", JSON.stringify(reportedVideos))
      
      toast({
        description: "Thanks for reporting",
        className: "bg-background border absolute bottom-4 left-4 rounded-lg",
        duration: 3000,
      })
      
      setIsReported(true)
      setIsJustReported(true)
    } catch (error) {
      console.error('Error handling report:', error)
    }
  }

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiked(video.id)) {
      removeFromLiked(video.id);
      toast({ description: "Removed from Favorites", duration: 2000 });
    } else {
      const videoToAdd = {
        ...video,
        likes: typeof video.likes === 'string' 
          ? (parseInt(video.likes.replace(/[^0-9]/g, '')) + 1).toString()
          : (video.likes || 0) + 1
      };
      addToLiked(videoToAdd);
      toast({ description: "Added to Favorites", duration: 2000 });
    }
  };

  // Format view count safely
  const formatViews = (views: number | string | undefined) => {
    if (!views) return "0"
    const viewCount = typeof views === "string" ? Number.parseInt(views) : views

    if (isNaN(viewCount)) return "0"
    if (viewCount >= 1000000) {
      return `${(viewCount / 1000000).toFixed(1)}M`
    } else if (viewCount >= 1000) {
      return `${(viewCount / 1000).toFixed(1)}K`
    }
    return viewCount.toString()
  }

  // Format upload date safely
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return ""
    
    // Check if the date is in the format "X days ago"
    if (typeof dateString === 'string' && 
       (dateString.includes("day") || 
        dateString.includes("month") || 
        dateString.includes("year"))) {
      return dateString
    }

    // Otherwise, try to parse it as a date
    try {
      const date = new Date(dateString)
      return formatDistanceToNow(date, { addSuffix: true })
    } catch (error) {
      console.error('Error formatting date:', error)
      return dateString || ""
    }
  }

  if (isReported && !isJustReported) return null
  if (isHidden && !isJustHidden) return null

  if (isJustReported) {
    return (
      <div className={layout === "list" ? "p-4" : "aspect-video"}>
        <div className="w-full h-full flex items-center justify-center bg-background border rounded-lg p-6">
          <p className="text-muted-foreground text-center">Thanks for reporting</p>
        </div>
      </div>
    )
  }

  if (isJustHidden) {
    return (
      <div className={layout === "list" ? "p-4" : "aspect-video"}>
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#282828] rounded-lg p-6 gap-4">
          <p className="text-sm text-neutral-400">Video removed</p>
          <div className="flex gap-4">
            <Button
              variant="link"
              className="text-blue-500 hover:text-blue-400 p-0 h-auto"
              onClick={handleUndo}
            >
              Undo
            </Button>
            <Button
              variant="link"
              className="text-blue-500 hover:text-blue-400 p-0 h-auto"
              onClick={() => setIsFeedbackOpen(true)}
            >
              Tell us why
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const videoId = video?.id ? String(video.id).replace('local-', '') : ''
  const thumbnailUrl = video?.thumbnail && video.thumbnail.trim() !== "" ? video.thumbnail : "/placeholder.svg?height=240&width=400"
  const isGoogleDrive = video?.thumbnail?.startsWith("https://drive.google.com") ?? false

  if (!video) {
    return null;
  }

  return (
    <>
      {layout === "list" ? (
        <div className="flex gap-4 hover:bg-accent/10 p-2 rounded-lg transition-colors">
          <Link href={`/video/${videoId}`} className="aspect-video w-40 relative rounded-md overflow-hidden flex-shrink-0">
            <Image
              src={thumbnailUrl}
              alt={video?.title || "Video thumbnail"}
              fill
              className="object-cover w-full h-full"
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg?height=240&width=400";
              }}
            />
          </Link>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-medium line-clamp-2">{video?.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{video?.uploader}</p>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <span>{formatViews(video?.views)} views</span>
              <span className="mx-1">•</span>
              <span>{formatDate(video?.uploadDate)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{video?.description}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent/50">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsShareOpen(true)}>
                <Share className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleWatchLater}>
                <Clock className="mr-2 h-4 w-4" />
                {isInWatchLater(video?.id) ? "Remove from Watch Later" : "Add to Watch Later"}
              </DropdownMenuItem>
              {context === 'history' && video?.id ? (
                <DropdownMenuItem onClick={() => onRemoveFromHistory?.(video.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove from watch history
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={handleNotInterested}>
                  <Ban className="mr-2 h-4 w-4" />
                  Not Interested
                </DropdownMenuItem>
              )}
              {context === 'favorites' && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    if (onRemoveFromHistory) {
                      onRemoveFromHistory(video.id)
                      toast({
                        title: "Removed from favorites",
                        description: "This video has been removed from your favorites.",
                      })
                    }
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove from favorites
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => setIsReportOpen(true)}>
                <Flag className="mr-2 h-4 w-4" />
                Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="group relative aspect-video rounded-lg overflow-hidden">
          <Link href={`/video/${videoId}`} className="block w-full h-full">
            <Image
              src={thumbnailUrl}
              alt={video?.title || "Video thumbnail"}
              fill
              className="object-cover w-full h-full"
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg?height=240&width=400";
              }}
            />
          </Link>
        </div>
      )}
      
      {isShareOpen && video?.id && (
        <SharePopup
          isOpen={isShareOpen}
          url={`${typeof window !== 'undefined' ? window.location.origin : ''}/video/${String(video.id)}`}
          title={video.title || ''}
          onClose={() => setIsShareOpen(false)}
        />
      )}
      <ReportDialog
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        onSubmit={handleReport}
      />
      {isFeedbackOpen && (
        <FeedbackDialog
          isOpen={isFeedbackOpen}
          onClose={() => setIsFeedbackOpen(false)}
          onSubmit={handleFeedbackSubmit}
        />
      )}
    </>
  )
}