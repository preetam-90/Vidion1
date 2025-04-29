"use client";

import React, { useState, useEffect } from "react";
import { videos as localVideos, Video } from "@/data";
import VideoCard from "@/app/components/VideoCard";
import { useRouter, useParams } from "next/navigation";
import { useInView } from 'react-intersection-observer';
import CategoryBar from "@/app/components/CategoryBar";

export default function CategoryPage() {
  const router = useRouter();
  const params = useParams();
  const category = params?.category as string;
  const decodedCategory = decodeURIComponent(category);
  
  // Infinite scroll settings
  const BATCH_SIZE = 12;
  const [displayCount, setDisplayCount] = useState<number>(BATCH_SIZE);
  const { ref: loadMoreRef, inView } = useInView({ rootMargin: '200px' });

  // When a user clicks a video card, navigate to the video player page
  const handleVideoClick = (video: Video) => {
    router.push(`/video/${video.id}`);
  };

  // Filter videos by the current category
  const categoryVideos = localVideos.filter(
    video => video.category && video.category.toLowerCase() === decodedCategory.toLowerCase()
  );

  // Load more videos when sentinel is in view
  useEffect(() => {
    if (inView && displayCount < categoryVideos.length) {
      setDisplayCount(prev => Math.min(prev + BATCH_SIZE, categoryVideos.length));
    }
  }, [inView, displayCount, categoryVideos.length]);

  // Format category name for display (capitalize first letter)
  const formatCategoryName = (name: string) => {
    return name.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  return (
    <>
      <div className="sticky top-0 left-0 right-0 z-40">
        <CategoryBar />
      </div>
      
      <div className="flex flex-col gap-6 pb-20 container max-w-full xl:max-w-[90%] 2xl:max-w-[95%] mx-auto px-4 md:px-6">
        <div className="mt-4">
          <h1 className="text-3xl font-bold">{formatCategoryName(decodedCategory)}</h1>
          <p className="text-muted-foreground mt-1">
            {categoryVideos.length} video{categoryVideos.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        {categoryVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
            {categoryVideos.slice(0, displayCount).map((video: Video, idx) => (
              <VideoCard
                key={`${video.id}-${idx}`}
                video={video}
                onClick={() => handleVideoClick(video)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl">No videos found in this category</p>
          </div>
        )}
        
        {displayCount < categoryVideos.length && (
          <div ref={loadMoreRef} className="h-1"></div>
        )}
      </div>
    </>
  );
} 