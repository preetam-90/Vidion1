"use client"

import { Video } from "@/data"
import VideoCard from "@/components/video-card"
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"
import { LazyComponent } from "./ui/lazy-component"

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