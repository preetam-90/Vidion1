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

interface MusicVideoOptionsDropdownProps {
  video: {
    id: string
    title: string
    thumbnail: string
    uploader?: string
    artist?: string
    views: string
    uploadDate?: string
  }
  onShare: () => void
  onFeedback: () => void
  onReport: () => void
}

export function MusicVideoOptionsDropdown({ video, onShare, onFeedback, onReport }: MusicVideoOptionsDropdownProps) {
  const { addToWatchLater, removeFromWatchLater, isInWatchLater } = useWatchLater()
  const { toast } = useToast()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8 absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
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
              duration: 3000,
            })
          } else {
            addToWatchLater({
              id: video.id,
              title: video.title,
              thumbnail: video.thumbnail,
              uploader: video.uploader || video.artist || "",
              views: typeof video.views === 'string' ? parseInt(video.views.replace(/[^0-9]/g, '')) || 0 : video.views,
              uploadDate: video.uploadDate || new Date().toISOString()
            })
            toast({
              description: "Added to Watch Later",
              duration: 3000,
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