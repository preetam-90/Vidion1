"use client"

import { Video } from "@/data"
import VideoCard from "./video-card"
import { useInfiniteScroll, useInfiniteAPIScroll } from "@/hooks/useInfiniteScroll"
import { LazyComponent } from "@/components/ui/lazy-component"
import { Loader2 } from "lucide-react"

interface VideoGridProps {
  videos: Video[]
  itemsPerPage?: number
}

export default function VideoGrid({ videos, itemsPerPage = 12 }: VideoGridProps) {
  const { items, hasMore, loaderRef } = useInfiniteScroll<Video>({
    initialData: videos,
    itemsPerPage,
  })

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((video) => (
          <LazyComponent 
            key={video.id} 
            className="min-h-[200px]"
            rootMargin="200px"
          >
            <VideoCard video={video} />
          </LazyComponent>
        ))}
      </div>
      
      {hasMore && (
        <div 
          ref={loaderRef} 
          className="h-20 flex items-center justify-center mt-4"
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </>
  )
}

interface InfiniteVideoGridProps {
  fetchVideos: (pageToken?: string, queryIndex?: number) => Promise<{
    items: Video[];
    nextPageToken?: string | null;
    nextQueryIndex?: number;
  }>;
  initialItems?: Video[];
  batchSize?: number;
}

export function InfiniteVideoGrid({ 
  fetchVideos,
  initialItems = [],
  batchSize = 12 
}: InfiniteVideoGridProps) {
  const { 
    items, 
    hasMore, 
    loaderRef,
    loading,
    error
  } = useInfiniteAPIScroll<Video>({
    fetchFunction: fetchVideos,
    batchSize,
    initialItems
  });

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading videos: {error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((video) => (
          <LazyComponent 
            key={video.id} 
            className="min-h-[200px]"
            rootMargin="200px"
          >
            <VideoCard video={video} />
          </LazyComponent>
        ))}
      </div>
      
      {hasMore && (
        <div 
          ref={loaderRef} 
          className="h-20 flex items-center justify-center mt-4"
        >
          {loading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          )}
        </div>
      )}
    </>
  )
} 