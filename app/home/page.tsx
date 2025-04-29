"use client";
import React, { useState, useEffect } from "react";
import { videos as localVideos, Video } from "@/data";
import VideoCard from "@/app/components/VideoCard";
import { useRouter } from "next/navigation";
import { useInView } from 'react-intersection-observer';
import CategoryBar from "@/app/components/CategoryBar";
import VideoCardSkeleton from "@/app/components/VideoCardSkeleton";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const router = useRouter();
  
  // Lazy loading for category sections
  const [categorySectionsLoaded, setCategorySectionsLoaded] = useState(false);
  const { ref: categorySectionRef, inView: categorySectionInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '200px'
  });
  
  // When a user clicks a video card, navigate to the video player page
  const handleVideoClick = (video: Video) => {
    router.push(`/video/${video.id}`);
  };

  // Load category sections when scrolled into view
  useEffect(() => {
    if (categorySectionInView) {
      // Add a small delay to simulate loading and prevent flickering
      const timer = setTimeout(() => {
        setCategorySectionsLoaded(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [categorySectionInView]);

  // Group videos by category to create sections
  const getVideosByCategory = () => {
    // Using explicit loop to avoid TypeScript errors with Set
    const uniqueCategories: string[] = [];
    const seen: Record<string, boolean> = {};
    
    for (const video of localVideos) {
      if (video.category && !seen[video.category]) {
        seen[video.category] = true;
        uniqueCategories.push(video.category);
      }
    }
    
    return uniqueCategories.map(category => ({
      category,
      videos: localVideos.filter(video => video.category === category).slice(0, 10) // Limit to 10 videos per category
    }));
  };

  const categorizedVideos = getVideosByCategory();

  // Common grid CSS class for consistent alignment
  const gridClass = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";

  return (
    <>
      <div className="sticky top-0 left-0 right-0 z-40">
        <CategoryBar />
      </div>
      
      <div className="flex flex-col gap-6 pb-20 container max-w-full xl:max-w-[90%] 2xl:max-w-[95%] mx-auto px-4 md:px-6">
        <h1 className="sr-only">Vidiony - Your Ultimate Video Streaming Platform</h1>
        
        {/* Category sections with improved alignment */}
        <div ref={categorySectionRef} className="mt-8 w-full">
          {categorySectionsLoaded ? (
            <div className="space-y-10 w-full">
              {categorizedVideos.map((categoryGroup, idx) => (
                <div key={idx} className="space-y-4 w-full">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">{categoryGroup.category}</h2>
                    <button 
                      onClick={() => router.push(`/category/${categoryGroup.category?.toLowerCase()}`)}
                      className="text-sm text-primary hover:underline"
                    >
                      View all
                    </button>
                  </div>
                  <div className={gridClass}>
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
          ) : (
            // Improved skeleton loading state for categories
            <div className="space-y-10 w-full">
              {[1, 2].map((_, catIdx) => (
                <div key={`cat-skeleton-${catIdx}`} className="space-y-4 w-full">
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-8 bg-muted/60 animate-pulse rounded-md w-48"></div>
                    <div className="h-6 bg-muted/60 animate-pulse rounded-md w-16"></div>
                  </div>
                  <div className={gridClass}>
                    {Array(6).fill(0).map((_, idx) => (
                      <VideoCardSkeleton key={`cat-card-skeleton-${catIdx}-${idx}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
