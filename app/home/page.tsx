"use client";
import React, { useState, useEffect } from "react";
import { videos as localVideos, Video } from "@/data";
import { useRouter } from "next/navigation";
import CategoryBar from "@/components/CategoryBar";
import { Loader2, Eye, Clock } from "lucide-react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
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

  // Get recommended/featured videos (first 5 videos)
  const featuredVideos = localVideos.slice(0, 5);
  
  // Get rest of categorized videos
  const categorizedVideos = getVideosByCategory();

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Featured video card component to avoid type issues
  const FeaturedVideoCard = ({ video }: { video: Video }) => (
    <Card 
      key={`featured-${video.id}`} 
      className="min-w-[300px] sm:min-w-[340px] overflow-hidden flex-shrink-0 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => handleVideoClick(video)}
    >
      <div className="relative w-full aspect-video">
        <Image
          src={video.thumbnail || '/placeholder-thumbnail.jpg'}
          alt={video.title}
          fill
          sizes="(max-width: 640px) 300px, 340px"
          className="object-cover"
        />
        {video.duration && (
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
            {video.duration}
          </span>
        )}
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-sm sm:text-base line-clamp-2 mb-1">{video.title}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground mb-2">{video.uploader}</p>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
            {video.views} views
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            {video.uploadDate}
          </span>
        </div>
      </div>
    </Card>
  );
  
  // Category video card component to avoid type issues
  const CategoryVideoCard = ({ video }: { video: Video }) => (
    <Card 
      className="min-w-[240px] sm:min-w-[280px] overflow-hidden flex-shrink-0 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => handleVideoClick(video)}
    >
      <div className="relative w-full aspect-video">
        <Image
          src={video.thumbnail || '/placeholder-thumbnail.jpg'}
          alt={video.title}
          fill
          sizes="(max-width: 640px) 240px, 280px"
          className="object-cover"
        />
        {video.duration && (
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
            {video.duration}
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm line-clamp-2 mb-1">{video.title}</h3>
        <p className="text-xs text-muted-foreground">{video.uploader}</p>
      </div>
    </Card>
  );

  return (
    <div className="pb-16 sm:pb-20">
      <div className="sticky top-0 left-0 right-0 z-40 bg-background">
        <CategoryBar />
      </div>
      
      <div className="container mx-auto px-0 sm:px-4 py-4 sm:py-8 max-w-[1800px]">
        <h1 className="sr-only">Vidiony - Your Ultimate Video Streaming Platform</h1>
        
        {/* Featured section with large cards */}
        <div className="mb-6 sm:mb-10">
          <div className="flex items-center justify-between mb-4 sm:mb-6 px-2 sm:px-0">
            <h2 className="text-xl sm:text-2xl font-bold">Featured Content</h2>
            <Button 
              variant="ghost" 
              className="text-xs sm:text-sm text-primary"
              onClick={() => router.push('/explore')}
            >
              View all
            </Button>
          </div>
          
          <ScrollArea className="w-full whitespace-nowrap pb-4">
            <div className="flex space-x-4 px-2 sm:px-0">
              {featuredVideos.map((video, idx) => (
                <FeaturedVideoCard key={`featured-${video.id}`} video={video} />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        
        {/* Category sections with improved alignment */}
        <div className="mt-4 sm:mt-8 w-full">
          <div className="space-y-6 sm:space-y-10 w-full">
            {categorizedVideos.map((categoryGroup, idx) => (
              <div key={idx} className="space-y-3 sm:space-y-4 w-full">
                <div className="flex items-center justify-between px-2 sm:px-0">
                  <h2 className="text-lg sm:text-2xl font-semibold">{categoryGroup.category}</h2>
                  <Button 
                    variant="ghost"
                    onClick={() => router.push(`/category/${categoryGroup.category?.toLowerCase()}`)}
                    className="text-xs sm:text-sm text-primary"
                  >
                    View all
                  </Button>
                </div>
                
                <ScrollArea className="w-full pb-4">
                  <div className="flex space-x-4 px-2 sm:px-0">
                    {categoryGroup.videos.map((video, videoIdx) => (
                      <CategoryVideoCard key={`${video.id}-cat-${videoIdx}`} video={video} />
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
