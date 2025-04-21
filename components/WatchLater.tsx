"use client";

import { Button } from "./ui/button";
import { MoreVertical, Play, Shuffle, Trash, Share2, Flag, MoveUp, MoveDown, ListPlus, Copy, X, ChevronLeft, ChevronRight, GripVertical, Menu } from "lucide-react";
import { useWatchLater } from "@/contexts/watch-later-context";
import type { Video } from "@/data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DroppableProvided,
  DroppableStateSnapshot,
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import Image from "next/image";
import { ReportDialog } from "./report-dialog"
import { useToast } from "@/components/ui/use-toast";

// Helper function to format views
function formatViews(views: string | number): string {
  const viewCount = typeof views === 'number' ? views : parseInt(views);
  if (isNaN(viewCount)) return `${views} views`;
  
  if (viewCount >= 1000000) {
    return `${(viewCount / 1000000).toFixed(1)}M views`;
  } else if (viewCount >= 1000) {
    return `${(viewCount / 1000).toFixed(1)}K views`;
  }
  return `${viewCount} views`;
}

interface SocialShareButton {
  name: string;
  icon: string;
  backgroundColor: string;
  shareUrl: (url: string, title: string) => string;
}

const socialButtons: SocialShareButton[] = [
  {
    name: "WhatsApp",
    icon: "/social/whatsapp.svg",
    backgroundColor: "#25D366",
    shareUrl: (url, title) => `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
  {
    name: "Telegram",
    icon: "/social/telegram.svg",
    backgroundColor: "#0088cc",
    shareUrl: (url, title) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    name: "Instagram",
    icon: "/social/instagram.svg",
    backgroundColor: "#E4405F",
    shareUrl: (url) => url, // Instagram doesn't support direct sharing, will copy to clipboard
  },
  {
    name: "X",
    icon: "/social/x.svg",
    backgroundColor: "#000000",
    shareUrl: (url, title) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    name: "Facebook",
    icon: "/social/facebook.svg",
    backgroundColor: "#1877f2",
    shareUrl: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
];

// Update the truncateUrl function to show simpler format
const truncateUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    // Only show domain and first part of the path
    const path = urlObj.pathname.split('/').filter(Boolean).slice(0, 2).join('/');
    return `${domain}/file/${path}...`;
  } catch (e) {
    // If URL parsing fails, just truncate
    return url.substring(0, 30) + '...';
  }
};

// Add color extraction function
function getDominantColor(imageSrc: string): Promise<string> {
  return new Promise((resolve) => {
    const img: HTMLImageElement = new Image();
    img.crossOrigin = "Anonymous";
    
    img.onload = () => {
      const canvas: HTMLCanvasElement = document.createElement("canvas");
      const context = canvas.getContext("2d", { willReadFrequently: true });
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (!context) {
        resolve("#000000");
        return;
      }

      context.drawImage(img, 0, 0, img.width, img.height);
      
      try {
        const imageData = context.getImageData(0, 0, img.width, img.height).data;
        
        let r = 0, g = 0, b = 0, count = 0;
        
        for (let i = 0; i < imageData.length; i += 4) {
          r += imageData[i];
          g += imageData[i + 1];
          b += imageData[i + 2];
          count++;
        }
        
        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);
        
        resolve(`rgb(${r}, ${g}, ${b})`);
      } catch (error) {
        resolve("#000000");
      }
    };
    
    img.onerror = () => resolve("#000000");
    img.src = imageSrc;
  });
}

interface ReportedVideo {
  videoId: string;
  reason: string;
  timestamp: string;
}

export default function WatchLater() {
  const router = useRouter();
  const { watchLaterVideos, removeFromWatchLater, updateWatchLaterOrder } = useWatchLater();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<typeof watchLaterVideos[0] | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number>(-1);
  const [isShuffleMode, setIsShuffleMode] = useState(false);
  const [playedIndices, setPlayedIndices] = useState<number[]>([]);
  const [expandedVideoId, setExpandedVideoId] = useState<string | number | null>(null);
  const [dominantColor, setDominantColor] = useState<string>("#000000");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const { toast } = useToast();

  // Check scroll position to show/hide arrows
  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  // Add scroll event listener when dialog opens
  useEffect(() => {
    if (shareDialogOpen && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.addEventListener('scroll', checkScrollButtons);
      // Initial check
      checkScrollButtons();
      
      return () => {
        container.removeEventListener('scroll', checkScrollButtons);
      };
    }
  }, [shareDialogOpen]);

  // Effect to extract dominant color when first video changes
  useEffect(() => {
    if (watchLaterVideos.length > 0 && watchLaterVideos[0]?.thumbnail) {
      getDominantColor(watchLaterVideos[0].thumbnail)
        .then(color => setDominantColor(color))
        .catch(() => setDominantColor("#000000"));
    }
  }, [watchLaterVideos.length, watchLaterVideos[0]?.thumbnail]);

  // Function to move video to top
  const moveToTop = (videoId: string | number) => {
    const videoIndex = watchLaterVideos.findIndex(v => v.id === videoId);
    if (videoIndex > 0) {
      const newVideos = [...watchLaterVideos];
      const [video] = newVideos.splice(videoIndex, 1);
      newVideos.unshift(video);
      // Update using context function directly
      updateWatchLaterOrder(newVideos);
    }
  };

  // Function to move video to bottom
  const moveToBottom = (videoId: string | number) => {
    const videoIndex = watchLaterVideos.findIndex(v => v.id === videoId);
    if (videoIndex < watchLaterVideos.length - 1) {
      const newVideos = [...watchLaterVideos];
      const [video] = newVideos.splice(videoIndex, 1);
      newVideos.push(video);
      // Update using context function directly
      updateWatchLaterOrder(newVideos);
    }
  };

  // Function to handle social media sharing
  const handleShare = (socialButton: SocialShareButton) => {
    if (!selectedVideo) return;

    if (socialButton.name === "Instagram") {
      // For Instagram, copy to clipboard and show message
      navigator.clipboard.writeText(selectedVideo.url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      alert("Link copied to clipboard. Open Instagram and paste to share.");
      return;
    }

    // Open share URL in new window
    const shareUrl = socialButton.shareUrl(selectedVideo.url, selectedVideo.title);
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  // Scroll icons left
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  // Scroll icons right
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      // Calculate how many icons are visible
      const container = scrollContainerRef.current;
      const iconWidth = 70; // Width of each icon including margin
      const visibleWidth = container.clientWidth;
      const visibleIcons = Math.floor(visibleWidth / iconWidth);
      
      // Scroll by exactly the width of visible icons minus 1 for overlap
      const scrollAmount = (visibleIcons - 1) * iconWidth;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Function to handle video completion and play next video
  const handleVideoComplete = () => {
    if (isShuffleMode) {
      playRandomVideo();
    } else {
      playNextVideo();
    }
  };

  // Function to play a specific video by index
  const playVideoByIndex = (index: number) => {
    if (index >= 0 && index < watchLaterVideos.length) {
      // Navigate to regular video page instead of player
      const video = watchLaterVideos[index];
      router.push(`/video/${video.id.toString().replace('local-', '')}`);
    }
  };

  // Function to play next video in sequence
  const playNextVideo = () => {
    const nextIndex = currentPlayingIndex + 1;
    if (nextIndex < watchLaterVideos.length) {
      playVideoByIndex(nextIndex);
    } else {
      // Reset to beginning if we've reached the end
      setCurrentPlayingIndex(-1);
      setPlayedIndices([]);
    }
  };

  // Function to play a random unplayed video
  const playRandomVideo = () => {
    const unplayedIndices = watchLaterVideos
      .map((_, index) => index)
      .filter(index => !playedIndices.includes(index));

    if (unplayedIndices.length > 0) {
      const randomIndex = Math.floor(Math.random() * unplayedIndices.length);
      const nextIndex = unplayedIndices[randomIndex];
      playVideoByIndex(nextIndex);
    } else {
      // All videos have been played, reset
      setCurrentPlayingIndex(-1);
      setPlayedIndices([]);
    }
  };

  // Function to start playing all videos
  const handlePlayAll = () => {
    // Start playing from the first video using regular video route
    if (watchLaterVideos.length > 0) {
      const firstVideo = watchLaterVideos[0];
      router.push(`/video/${firstVideo.id.toString().replace('local-', '')}`);
    }
  };

  // Function to start shuffle play
  const handleShuffle = () => {
    // Start playing from a random video using regular video route
    if (watchLaterVideos.length > 0) {
      const randomIndex = Math.floor(Math.random() * watchLaterVideos.length);
      const randomVideo = watchLaterVideos[randomIndex];
      router.push(`/video/${randomVideo.id.toString().replace('local-', '')}`);
    }
  };

  // Function to handle drag end
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(watchLaterVideos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the watch later list with new order
    updateWatchLaterOrder(items);
  };

  // Function to toggle video expansion
  const toggleVideoExpansion = (videoId: string | number) => {
    setExpandedVideoId(expandedVideoId === videoId ? null : videoId);
  };

  // Share dialog component
  const ShareDialog = () => (
    <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <div className="bg-background px-4 py-2 flex items-center justify-between border-b">
          <DialogTitle className="text-xl font-semibold">Share</DialogTitle>
        </div>
        
        {selectedVideo && (
          <div className="px-4 pt-3 pb-1">
            <h3 className="text-sm font-medium line-clamp-2">{selectedVideo.title}</h3>
          </div>
        )}
        
        <div className="px-4 pt-2 overflow-auto">
          <div 
            className="flex py-2 space-x-4 justify-center"
          >
            {socialButtons.map((button) => (
              <button
                key={button.name}
                onClick={() => handleShare(button)}
                className="flex flex-col items-center gap-1 min-w-[60px]"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: button.backgroundColor }}
                >
                  <img
                    src={button.icon}
                    alt={button.name}
                    className="w-6 h-6"
                  />
                </div>
                <span className="text-xs text-center">{button.name}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="bg-[#0f0f0f] p-4 mt-2">
          <div className="flex items-center space-x-2">
            <p 
              className="text-sm flex-1 text-white px-2 py-1.5 truncate cursor-pointer"
              onClick={(e) => {
                if (selectedVideo?.url) {
                  // Create a range and select the text
                  const range = document.createRange();
                  range.selectNodeContents(e.currentTarget);
                  const selection = window.getSelection();
                  if (selection) {
                    selection.removeAllRanges();
                    selection.addRange(range);
                  }
                }
              }}
            >
              {selectedVideo ? truncateUrl(selectedVideo.url) : ""}
            </p>
            <Button
              onClick={() => {
                if (selectedVideo?.url) {
                  navigator.clipboard.writeText(selectedVideo.url);
                  setCopySuccess(true);
                  setTimeout(() => setCopySuccess(false), 2000);
                }
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white shrink-0 px-4 py-1.5 h-auto rounded-md font-medium"
            >
              {copySuccess ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const handleReport = async (videoId: string, reason: string) => {
    if (!videoId) return;
    
    try {
      // Get existing reported videos from localStorage
      const existingReported = localStorage.getItem("reportedVideos");
      const reportedVideos: ReportedVideo[] = existingReported ? JSON.parse(existingReported) : [];
      
      // Add new reported video with properly typed Date constructor
      const timestamp = new Date().toISOString();
      reportedVideos.push({
        videoId,
        reason,
        timestamp
      });
      
      // Save back to localStorage
      localStorage.setItem("reportedVideos", JSON.stringify(reportedVideos));
      
      toast({
        title: "Video Reported",
        description: "Thanks for reporting",
        className: "bg-background border absolute bottom-4 left-4 rounded-lg",
        duration: 3000,
      });

      setIsReportOpen(false);
    } catch (error) {
      console.error('Error handling report:', error);
      toast({
        title: "Error",
        description: "Failed to submit report",
        variant: "destructive",
        className: "bg-background border absolute bottom-4 left-4 rounded-lg",
        duration: 3000,
      });
    }
  };

  if (watchLaterVideos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <h1 className="text-2xl font-bold mb-4">Watch later</h1>
        <p className="text-muted-foreground">No videos added to watch later yet.</p>
      </div>
    );
  }

  // Get the first video for the main thumbnail
  const firstVideo = watchLaterVideos[0] || null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <ShareDialog />
      
      <div className="flex flex-col md:flex-row">
        {/* Left Sidebar - Featured Video Thumbnail */}
        <div 
          className="relative p-6 md:w-1/3 lg:w-1/4 md:h-[500px] md:sticky md:top-4"
          style={{
            background: `linear-gradient(to bottom, ${dominantColor}20, ${dominantColor}05)`,
          }}
        >
          <div className="flex flex-col h-full">
            {/* Thumbnail with blurred background */}
            <div className="relative">
              {/* Blurred background */}
              <div 
                className="absolute -inset-8 -z-10 bg-cover bg-center blur-3xl opacity-70 rounded-xl"
                style={{
                  backgroundImage: `url(${firstVideo?.thumbnail})`,
                  transform: 'scale(1.2)',
                  backdropFilter: 'blur(20px)',
                }}
              />
              {/* Gradient overlay */}
              <div 
                className="absolute -inset-8 -z-10 rounded-xl"
                style={{
                  background: `linear-gradient(180deg, 
                    ${dominantColor}30 0%, 
                    ${dominantColor}20 50%, 
                    ${dominantColor}10 100%
                  )`,
                  backdropFilter: 'blur(20px)',
                }}
              />
              
              {/* Main thumbnail */}
              <div className="relative w-full aspect-video bg-muted rounded-xl overflow-hidden shadow-lg">
                <img
                  src={firstVideo?.thumbnail}
                  alt={firstVideo?.title}
                  className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                />
                {firstVideo?.duration && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 px-1.5 py-0.5 rounded text-xs text-white">
                    {firstVideo.duration}
                  </div>
                )}
              </div>
            </div>

            {/* Playlist Info */}
            <div className="space-y-2 mt-4 backdrop-blur-md bg-background/20 p-4 rounded-xl">
              <h1 className="text-2xl font-bold">Watch later</h1>
              <div className="flex flex-col text-sm text-muted-foreground">
                <span className="font-medium">{firstVideo?.uploader}</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span>{watchLaterVideos.length} videos</span>
                  <span>•</span>
                  <span>{watchLaterVideos.reduce((total, video) => total + (typeof video.views === 'number' ? video.views : parseInt(video.views)), 0).toLocaleString()} views</span>
                  <span>•</span>
                  <span>Updated today</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 mt-6">
              <Button 
                className="w-full h-11 rounded-full bg-white hover:bg-white/90 text-black backdrop-blur-sm"
                onClick={handlePlayAll}
              >
                <Play className="h-5 w-5 mr-2" />
                Play all
              </Button>
              <Button 
                variant="secondary" 
                className="w-full h-11 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
                onClick={handleShuffle}
              >
                <Shuffle className="h-5 w-5 mr-2" />
                Shuffle
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side - Video List */}
        <div className="flex-1 p-6">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="watch-later-list">
              {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "space-y-2 transition-colors",
                    snapshot.isDraggingOver && "bg-accent/50 rounded-lg p-2"
                  )}
                >
                  {watchLaterVideos.map((video, index) => (
                    <Draggable 
                      key={video.id} 
                      draggableId={video.id.toString()} 
                      index={index}
                    >
                      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={cn(
                            "group relative bg-background rounded-lg transition-all",
                            snapshot.isDragging ? "shadow-lg scale-[1.02] z-50" : "hover:bg-accent",
                            expandedVideoId === video.id && "bg-accent"
                          )}
                        >
                          <div className="flex gap-4 p-2">
                            {/* Drag Handle */}
                            <div
                              {...provided.dragHandleProps}
                              className="flex items-center px-2 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
                            >
                              <GripVertical className="h-5 w-5" />
                            </div>

                            {/* Thumbnail */}
                            <div 
                              className="relative w-48 h-28 bg-muted rounded-lg overflow-hidden cursor-pointer"
                              onClick={() => router.push(`/video/${video.id.toString().replace('local-', '')}`)}
                            >
                              <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="object-cover w-full h-full"
                              />
                              {video.duration && (
                                <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 px-1 rounded text-xs text-white">
                                  {video.duration}
                                </div>
                              )}
                            </div>

                            {/* Video Info */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold line-clamp-2 text-base mb-1 cursor-pointer"
                                  onClick={() => router.push(`/video/${video.id.toString().replace('local-', '')}`)}>
                                {video.title}
                              </h3>
                              <div className="text-sm text-muted-foreground space-y-0.5">
                                <div className="font-medium">{video.uploader}</div>
                                <div className="flex items-center gap-1">
                                  <span>{formatViews(video.views)}</span>
                                  <span className="text-xs mx-1">•</span>
                                  <span>{video.uploadDate}</span>
                                </div>
                              </div>
                            </div>

                            {/* Actions Dropdown */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="opacity-0 group-hover:opacity-100 self-start"
                                >
                                  <MoreVertical className="h-5 w-5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem
                                  onClick={() => removeFromWatchLater(video.id)}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  Remove from Watch Later
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <ListPlus className="mr-2 h-4 w-4" />
                                  Save to playlist
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedVideo(video);
                                    setShareDialogOpen(true);
                                  }}
                                >
                                  <Share2 className="mr-2 h-4 w-4" />
                                  Share
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedVideoId(video.id.toString())
                                    setIsReportOpen(true)
                                  }}
                                >
                                  <Flag className="mr-2 h-4 w-4" />
                                  Report
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => moveToTop(video.id)}>
                                  <MoveUp className="mr-2 h-4 w-4" />
                                  Move to top
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => moveToBottom(video.id)}>
                                  <MoveDown className="mr-2 h-4 w-4" />
                                  Move to bottom
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* Expanded Content */}
                          {expandedVideoId === video.id && (
                            <div className="p-4 border-t bg-accent/50 rounded-b-lg space-y-2">
                              <p className="text-sm text-muted-foreground line-clamp-3">
                                {video.description}
                              </p>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  onClick={() => router.push(`/video/${video.id.toString().replace('local-', '')}`)}
                                  className="w-full sm:w-auto"
                                >
                                  <Play className="h-4 w-4 mr-2" />
                                  Play Now
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="secondary"
                                  onClick={() => {
                                    setSelectedVideo(video);
                                    setShareDialogOpen(true);
                                  }}
                                  className="w-full sm:w-auto"
                                >
                                  <Share2 className="h-4 w-4 mr-2" />
                                  Share
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
      {isReportOpen && selectedVideoId && (
        <ReportDialog
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          onSubmit={(reason) => handleReport(selectedVideoId, reason)}
        />
      )}
    </div>
  );
} 