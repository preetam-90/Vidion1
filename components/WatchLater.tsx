"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWatchLater } from "@/contexts/watch-later-context";
import type { Video } from "@/data";
import { Button } from "@/components/ui/button";
import { Play, Shuffle, Trash, Share2, MoreVertical, Download, GripVertical, Clock } from "lucide-react";
import { extractYouTubeVideoId, getYouTubeThumbnailUrl, getBestThumbnailUrl } from "@/lib/thumbnail-utils";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
  type DroppableProvided,
  type DraggableProvided,
} from "@hello-pangea/dnd";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function WatchLater() {
  const router = useRouter();
  const { watchLaterVideos = [], removeFromWatchLater, updateWatchLaterOrder } = useWatchLater();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !isClient) return;

    const items = Array.from(watchLaterVideos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    updateWatchLaterOrder(items);
  };

  const getSafeImageUrl = (url: string | null) => {
    if (!url || url.trim() === "") {
      return "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"; // Default thumbnail if none exists
    }

    // Handle YouTube URLs - extract video ID and construct proper thumbnail URL
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      try {
        const videoId = extractYouTubeVideoId(url);
        if (videoId) {
          // Return high-quality thumbnail URL
          return getYouTubeThumbnailUrl(videoId, 'hqdefault');
        }
      } catch (error) {
        console.error('Error parsing YouTube URL:', error);
      }
    }

    try {
      new URL(url);
      return url;
    } catch {
      // If URL is invalid but contains what looks like a YouTube video ID (11 chars)
      if (url.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(url)) {
        return getYouTubeThumbnailUrl(url, 'hqdefault');
      }
      return "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"; // Default thumbnail for invalid URLs
    }
  };

  const formatViews = (views: number | string) => {
    const num = typeof views === 'string' ? parseInt(views.replace(/[^0-9]/g, '')) : views;
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M views`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K views`;
    }
    return `${num} views`;
  };

  const formatUploadDate = (date: string) => {
    const uploadDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - uploadDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays <= 30) return `${diffDays} days ago`;
    if (diffDays <= 60) return '1 month ago';
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  // Calculate total views
  const getTotalViews = () => {
    if (watchLaterVideos.length === 0) return 0;
    
    return watchLaterVideos.reduce((total, video) => {
      if (!video.views) return total;
      const viewCount = typeof video.views === 'string' 
        ? parseInt(video.views.replace(/[^0-9]/g, ''), 10) || 0
        : video.views || 0;
      return total + viewCount;
    }, 0);
  };

  const totalViews = getTotalViews();
  const hasViews = totalViews > 0;

  if (!isClient) {
    return <div className="p-8 text-center">Loading Watch Later...</div>;
  }

  if (watchLaterVideos.length === 0) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] bg-[#0F0F0F] text-white">
        <h1 className="text-2xl font-bold mb-4">Watch Later</h1>
        <p className="text-neutral-400">No videos added to watch later yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0F0F0F] text-white min-h-screen">
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-[350px] min-h-screen bg-gradient-to-b from-neutral-800 to-[#121212] p-0 sticky top-0 flex flex-col">
          <div className="relative w-full mb-0">
            {watchLaterVideos[0]?.thumbnail && (
              <img
                src={getSafeImageUrl(watchLaterVideos[0].thumbnail) || undefined}
                alt="Playlist thumbnail"
                className="w-full aspect-video object-cover"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg";
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/70"></div>
          </div>
          
          <div className="px-6 py-4">
            <div className="text-sm text-neutral-400">
              {watchLaterVideos.length} {watchLaterVideos.length === 1 ? 'video' : 'videos'} · 
              {hasViews ? formatViews(totalViews) : 'No views'} · 
              Updated today
            </div>
          </div>
          
          <div className="px-6 mt-4">
            <div className="flex gap-2 mb-3">
              <Button 
                onClick={() => router.push(`/video/${watchLaterVideos[0]?.id}`)}
                className="flex-1 bg-white text-black hover:bg-white/90 justify-center rounded-full font-medium"
                disabled={watchLaterVideos.length === 0}
              >
                <Play className="mr-2 h-4 w-4" /> Play all
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 text-white border-neutral-700 hover:bg-neutral-700/50 justify-center rounded-full font-medium"
                disabled={watchLaterVideos.length === 0}
              >
                <Shuffle className="mr-2 h-4 w-4" /> Shuffle
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-[1800px] mx-auto">
            {/* Header */}
            <div className="flex items-center mb-8">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold">Watch Later</h1>
                <div className="text-sm text-neutral-400">
                  {watchLaterVideos.length} {watchLaterVideos.length === 1 ? 'video' : 'videos'}
                </div>
              </div>
            </div>

            {/* Videos List */}
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="watch-later-videos">
                {(provided: DroppableProvided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-3"
                  >
                    {watchLaterVideos.map((video, index) => {
                      const imageUrl = getSafeImageUrl(video.thumbnail);
                      
                      return (
                        <Draggable
                          key={video.id}
                          draggableId={video.id.toString()}
                          index={index}
                        >
                          {(provided: DraggableProvided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="flex items-start gap-5 p-3 rounded-lg hover:bg-white/5 transition-colors group"
                            >
                              <div
                                {...provided.dragHandleProps}
                                className="text-neutral-500 cursor-grab pt-2"
                              >
                                <GripVertical className="h-5 w-5" />
                              </div>
                              
                              <div 
                                className="relative aspect-video w-48 bg-neutral-800 rounded-lg overflow-hidden cursor-pointer"
                                onClick={() => router.push(`/video/${video.id}`)}
                              >
                                <img
                                  src={imageUrl || "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"}
                                  alt={video.title || "Video thumbnail"}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    
                                    // Try multiple fallback strategies
                                    // 1. Try to use YouTube ID if available
                                    if (typeof video.id === 'string' && video.id.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(video.id)) {
                                      target.src = getYouTubeThumbnailUrl(video.id, 'hqdefault');
                                      return;
                                    }
                                    
                                    // 2. Try to extract from URL if available
                                    if (video.url) {
                                      const videoId = extractYouTubeVideoId(video.url);
                                      if (videoId) {
                                        target.src = getYouTubeThumbnailUrl(videoId, 'hqdefault');
                                        return;
                                      }
                                    }
                                    
                                    // 3. Final fallback
                                    target.src = "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg";
                                  }}
                                />
                                {video.duration && (
                                  <div className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.5 text-xs rounded">
                                    {video.duration}
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex-1 min-w-0 pt-1">
                                <h3 
                                  className="font-medium text-base line-clamp-2 cursor-pointer hover:text-neutral-100"
                                  onClick={() => router.push(`/video/${video.id}`)}
                                >
                                  {video.title}
                                </h3>
                                <div className="mt-2 text-sm text-neutral-400">
                                  <p className="hover:text-neutral-100 cursor-pointer">{video.uploader}</p>
                                  <div className="flex items-center gap-1 mt-1">
                                    {video.views && <span>{formatViews(video.views)}</span>}
                                    {video.views && video.uploadDate && <span>•</span>}
                                    {video.uploadDate && <span>{formatUploadDate(video.uploadDate)}</span>}
                                  </div>
                                </div>
                              </div>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-[#282828] border-neutral-700 w-48">
                                  <DropdownMenuItem 
                                    className="text-white hover:bg-white/10 cursor-pointer"
                                    onClick={() => router.push(`/video/${video.id}`)}
                                  >
                                    <Play className="mr-2 h-4 w-4" /> Play
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-white hover:bg-white/10 cursor-pointer"
                                    onClick={() => removeFromWatchLater(video.id)}
                                  >
                                    <Clock className="mr-2 h-4 w-4" /> Remove from Watch Later
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-white hover:bg-white/10 cursor-pointer"
                                  >
                                    <Share2 className="mr-2 h-4 w-4" /> Share
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-white hover:bg-white/10 cursor-pointer"
                                  >
                                    <Download className="mr-2 h-4 w-4" /> Download
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </div>
    </div>
  );
} 