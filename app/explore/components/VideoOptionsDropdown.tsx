import { MoreVertical, Share, Clock, Ban, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useWatchLater } from "@/contexts/watch-later-context"
import { useToast } from "@/components/ui/use-toast"

interface VideoOptionsDropdownProps {
  video: {
    id: string
    title: string
    thumbnail: string
    channelTitle: string
    viewCount: string
    publishedAt: string
    isShort?: boolean
  }
  onShare: () => void
  onFeedback: () => void
  onReport: () => void
  className?: string
}

export function VideoOptionsDropdown({ 
  video, 
  onShare, 
  onFeedback, 
  onReport,
  className = ""
}: VideoOptionsDropdownProps) {
  const { addToWatchLater, removeFromWatchLater, isInWatchLater } = useWatchLater()
  const { toast } = useToast()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button 
          variant="ghost" 
          size="icon"
          className={`h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity ${
            video.isShort 
              ? "absolute right-1 top-1 bg-black/40 hover:bg-black/60 text-white rounded-full p-1" 
              : "absolute right-2 top-2"
          } ${className}`}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={(e) => {
          e.stopPropagation()
          onShare()
        }}>
          <Share className="mr-2 h-4 w-4" />
          Share
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => {
          e.stopPropagation()
          if (isInWatchLater(video.id)) {
            removeFromWatchLater(video.id)
            toast({
              description: "Removed from Watch Later",
              duration: 2000,
            })
          } else {
            addToWatchLater({
              id: video.id,
              title: video.title,
              thumbnail: video.thumbnail,
              uploader: video.channelTitle,
              views: parseInt(video.viewCount.replace(/[^0-9]/g, '')),
              uploadDate: video.publishedAt,
              platform: 'youtube',
              category: video.isShort ? 'shorts' : 'video',
              url: video.isShort 
                ? `https://www.youtube.com/shorts/${video.id}`
                : `https://www.youtube.com/watch?v=${video.id}`,
              duration: '',
              description: '',
              likes: 0,
              comments: 0
            })
            toast({
              description: "Added to Watch Later",
              duration: 2000,
            })
          }
        }}>
          <Clock className="mr-2 h-4 w-4" />
          {isInWatchLater(video.id) ? 'Remove from Watch Later' : 'Save to Watch Later'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => {
          e.stopPropagation()
          onFeedback()
        }}>
          <Ban className="mr-2 h-4 w-4" />
          Not Interested
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => {
          e.stopPropagation()
          onReport()
        }}>
          <Flag className="mr-2 h-4 w-4" />
          Report
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 