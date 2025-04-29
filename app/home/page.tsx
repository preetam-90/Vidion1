"use client";
import React, { useState, useEffect } from "react";
import { videos as localVideos, Video } from "@/data";
import VideoCard from "@/app/components/VideoCard";
import { useRouter } from "next/navigation";
import { useInView } from 'react-intersection-observer';
import CategoryBar from "@/app/components/CategoryBar";

export default function HomePage() {
  const router = useRouter();

  // Infinite scroll settings
  const BATCH_SIZE = 8;
  const [displayCount, setDisplayCount] = useState<number>(BATCH_SIZE);
  const { ref: loadMoreRef, inView } = useInView({ rootMargin: '200px' });

  // When a user clicks a video card, navigate to the video player page
  const handleVideoClick = (video: Video) => {
    router.push(`/video/${video.id}`);
  };

  // Load more videos when sentinel is in view
  useEffect(() => {
    if (inView && displayCount < localVideos.length) {
      setDisplayCount(prev => Math.min(prev + BATCH_SIZE, localVideos.length));
    }
  }, [inView, displayCount]);

  // Group videos by category to create sections
  const getVideosByCategory = () => {
    const categories = Array.from(new Set(localVideos.map(video => video.category)))
      .filter(category => category); // Filter out undefined/null categories
    
    return categories.map(category => ({
      category,
      videos: localVideos.filter(video => video.category === category).slice(0, 10) // Limit to 10 videos per category
    }));
  };

  const categorizedVideos = getVideosByCategory();

  return (
    <>
      <div className="sticky top-0 left-0 right-0 z-40">
        <CategoryBar />
      </div>
      
      <div className="flex flex-col gap-6 pb-20 container max-w-full xl:max-w-[90%] 2xl:max-w-[95%] mx-auto px-4 md:px-6">
        <div className="mt-4">
          <p className="text-muted-foreground">Featured Videos</p>
        </div>
        
        {/* Featured videos grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
          {localVideos.slice(0, displayCount).map((video: Video, idx) => (
            <VideoCard
              key={`${video.id}-${idx}`}
              video={video}
              onClick={() => handleVideoClick(video)}
            />
          ))}
        </div>
        
        {/* Category sections */}
        {categorizedVideos.length > 0 && (
          <div className="mt-8 space-y-8">
            {categorizedVideos.map((categoryGroup, idx) => (
              <div key={idx} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">{categoryGroup.category}</h2>
                  <button 
                    onClick={() => router.push(`/category/${categoryGroup.category?.toLowerCase()}`)}
                    className="text-sm text-primary hover:underline"
                  >
                    View all
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
                  {categoryGroup.videos.map((video: Video, idx) => (
                    <VideoCard
                      key={`${video.id}-cat-${idx}`}
                      video={video}
                      onClick={() => handleVideoClick(video)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div ref={loadMoreRef} className="h-1"></div>
      </div>
    </>
  );
}
