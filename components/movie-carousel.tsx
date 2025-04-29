"use client"

import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { formatDistanceToNowStrict } from 'date-fns'

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Video, MovieCategory } from '@/types/data'

// Helper function to format view counts
const formatViewCount = (count: string | number | undefined): string => {
  if (count === undefined) return "0 views"
  const numCount = typeof count === "string" ? parseInt(count.replace(/[^0-9]/g, '')) : count
  if (isNaN(numCount)) return "0 views"
  
  try {
    if (numCount >= 1_000_000_000) {
      return (numCount / 1_000_000_000).toFixed(1).replace(".0", "") + "B views"
    }
    if (numCount >= 1_000_000) {
      return (numCount / 1_000_000).toFixed(1).replace(".0", "") + "M views"
    }
    if (numCount >= 1_000) {
      return (numCount / 1_000).toFixed(1).replace(".0", "") + "K views"
    }
    return numCount.toString() + " views"
  } catch (error) {
    console.error("Error formatting view count:", error)
    return "0 views"
  }
}

// Helper function for formatting ISO 8601 duration to readable format
const formatDuration = (duration: string | undefined): string => {
  if (!duration) return "";
  
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "";
  
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

// Helper function for safe date formatting
const formatPublishedDate = (dateString: string | undefined): string => {
  if (!dateString) return ""
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return ""
    }
    return formatDistanceToNowStrict(date) + " ago"
  } catch (error) {
    console.error("Error formatting date:", error)
    return ""
  }
}

interface MovieCarouselProps {
  category: MovieCategory;
}

export default function MovieCarousel({ category }: MovieCarouselProps) {
  const router = useRouter()

  const handleVideoClick = (video: Video) => {
    sessionStorage.setItem('currentVideo', JSON.stringify({
      id: video.id,
      title: video.title,
      platform: 'youtube',
      thumbnailUrl: video.thumbnail,
      viewCount: typeof video.views === 'string' ? parseInt(video.views.replace(/[^0-9]/g, '')) : video.views,
      publishedAt: video.uploadDate
    }))
    router.push(`/video/${video.id}`)
  }

  if (category.type === 'featured') {
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{category.title}</h2>
          {category.showMore && (
            <button className="text-sm flex items-center text-muted-foreground hover:text-primary">
              See more <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          )}
        </div>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {category.videos.map((video) => (
              <CarouselItem key={video.id} className="basis-full md:basis-3/4 lg:basis-2/3">
                <div 
                  className="relative aspect-[16/9] overflow-hidden rounded-lg cursor-pointer"
                  onClick={() => handleVideoClick(video)}
                >
                  <Image
                    src={video.thumbnail || '/placeholder-thumbnail.jpg'}
                    alt={video.title}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 66vw"
                  />
                  {video.duration && (
                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                      {formatDuration(video.duration)}
                    </span>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-white text-lg font-semibold line-clamp-2 mb-1">{video.title}</h3>
                    <p className="text-white/80 text-sm">{video.uploader}</p>
                    <div className="flex items-center mt-1 text-white/70 text-xs">
                      <span>{formatViewCount(video.views)}</span>
                      <span className="mx-2">•</span>
                      <span>{formatPublishedDate(video.uploadDate)}</span>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 bg-black/50 hover:bg-black/70 border-none text-white" />
          <CarouselNext className="right-2 bg-black/50 hover:bg-black/70 border-none text-white" />
        </Carousel>
      </div>
    )
  }
  
  // For horizontal regular carousels
  if (category.type === 'horizontal') {
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{category.title}</h2>
          {category.showMore && (
            <button className="text-sm flex items-center text-muted-foreground hover:text-primary">
              See more <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          )}
        </div>
        
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent>
            {category.videos.map((video) => (
              <CarouselItem key={video.id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                <div 
                  className="relative cursor-pointer group"
                  onClick={() => handleVideoClick(video)}
                >
                  <div className="relative aspect-video overflow-hidden rounded-lg mb-2">
                    <Image
                      src={video.thumbnail || '/placeholder-thumbnail.jpg'}
                      alt={video.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                    />
                    {video.duration && (
                      <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                        {formatDuration(video.duration)}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-sm font-medium line-clamp-2 mb-1 group-hover:text-primary">{video.title}</h3>
                  <p className="text-xs text-muted-foreground">{video.uploader}</p>
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    <span>{formatViewCount(video.views)}</span>
                    <span className="mx-1">•</span>
                    <span>{formatPublishedDate(video.uploadDate)}</span>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 bg-black/50 hover:bg-black/70 border-none text-white" />
          <CarouselNext className="right-2 bg-black/50 hover:bg-black/70 border-none text-white" />
        </Carousel>
      </div>
    )
  }

  // For language selection or special categories
  if (category.type === 'language') {
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{category.title}</h2>
          {category.showMore && (
            <button className="text-sm flex items-center text-muted-foreground hover:text-primary">
              See more <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {category.videos.map((video) => (
            <div 
              key={video.id}
              className="relative overflow-hidden rounded-xl cursor-pointer group bg-muted"
              onClick={() => handleVideoClick(video)}
            >
              <div className="relative aspect-[2/1] overflow-hidden">
                <Image
                  src={video.thumbnail || '/placeholder-thumbnail.jpg'}
                  alt={video.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-4">
                  <h3 className="text-white text-lg font-bold">{category.label || video.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Small items layout
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{category.title}</h2>
        {category.showMore && (
          <button className="text-sm flex items-center text-muted-foreground hover:text-primary">
            See more <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        )}
      </div>
      
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent>
          {category.videos.map((video) => (
            <CarouselItem key={video.id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
              <div 
                className="relative cursor-pointer group"
                onClick={() => handleVideoClick(video)}
              >
                <div className="relative aspect-[3/2] overflow-hidden rounded-lg mb-2">
                  <Image
                    src={video.thumbnail || '/placeholder-thumbnail.jpg'}
                    alt={video.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                  />
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded">
                    {category.label || "NEW"}
                  </div>
                </div>
                
                <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary">{video.title}</h3>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 bg-black/50 hover:bg-black/70 border-none text-white" />
        <CarouselNext className="right-2 bg-black/50 hover:bg-black/70 border-none text-white" />
      </Carousel>
    </div>
  )
} 