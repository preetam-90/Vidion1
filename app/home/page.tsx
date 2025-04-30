"use client";
import React from "react";
import { videos as localVideos, Video } from "@/data";
import VideoCard from "@/components/VideoCard";
import { useRouter } from "next/navigation";
import CategoryBar from "@/components/CategoryBar";

export default function HomePage() {
  const router = useRouter();
  
  // When a user clicks a video card, navigate to the video player page
  const handleVideoClick = (video: Video) => {
    router.push(`/video/${video.id}`);
  };

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
  const gridClass = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4";

  return (
    <React.Fragment>
      <div className="sticky top-0 left-0 right-0 z-40">
        <CategoryBar />
      </div>
      
      <div className="flex flex-col gap-4 sm:gap-6 pb-16 sm:pb-20 container max-w-full xl:max-w-[90%] 2xl:max-w-[95%] mx-auto px-2 sm:px-4 md:px-6">
        <h1 className="sr-only">Vidiony - Your Ultimate Video Streaming Platform</h1>
        
        {/* Category sections with improved alignment */}
        <div className="mt-4 sm:mt-8 w-full">
          <div className="space-y-6 sm:space-y-10 w-full">
            {categorizedVideos.map((categoryGroup, idx) => (
              <div key={idx} className="space-y-3 sm:space-y-4 w-full">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-lg sm:text-2xl font-semibold">{categoryGroup.category}</h2>
                  <button 
                    onClick={() => router.push(`/category/${categoryGroup.category?.toLowerCase()}`)}
                    className="text-xs sm:text-sm text-primary hover:underline"
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
        </div>
      </div>
    </React.Fragment>
  );
}
