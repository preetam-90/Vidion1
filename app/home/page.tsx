"use client";

import React, { useState, useEffect, useCallback } from "react";
import { videos as localVideos, Video } from "@/data";
import { useRouter } from "next/navigation";
import CategoryBar from "@/components/CategoryBar";
import { Loader2, Eye, Clock, Code } from "lucide-react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { InfiniteVideoGrid } from "@/components/video-grid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [featuredVideos, setFeaturedVideos] = useState<Video[]>([]);
  const [categorizedVideos, setCategorizedVideos] = useState<{ category: string; videos: Video[] }[]>([]);
  const [activeTab, setActiveTab] = useState("youtube");

  // Helper function to format view counts
  const formatViewCount = (count: string | number | undefined): string => {
    if (!count) return '0 views'
    
    let numCount: number
    if (typeof count === 'string') {
      numCount = parseInt(count.replace(/[^0-9]/g, ''))
      if (isNaN(numCount)) return '0 views'
    } else {
      numCount = count
    }
    
    if (numCount >= 1000000000) {
      return `${(numCount / 1000000000).toFixed(1).replace(/\.0$/, '')}B views`
    } else if (numCount >= 1000000) {
      return `${(numCount / 1000000).toFixed(1).replace(/\.0$/, '')}M views`
    } else if (numCount >= 1000) {
      return `${(numCount / 1000).toFixed(1).replace(/\.0$/, '')}K views`
    } else {
      return `${numCount} views`
    }
  }

  // Helper function to format published date
  const formatPublishedDate = (dateString: string | undefined): string => {
    if (!dateString) return ''
    
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return ''
      
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - date.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays < 1) return 'Today'
      if (diffDays === 1) return 'Yesterday'
      if (diffDays < 7) return `${diffDays} days ago`
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
      return `${Math.floor(diffDays / 365)} years ago`
    } catch (e) {
      return ''
    }
  }

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

  // Set initial state when component mounts
  useEffect(() => {
    // Get recommended/featured videos (first 5 videos in their original order)
    setFeaturedVideos(localVideos.slice(0, 5));
    
    // Get rest of categorized videos
    setCategorizedVideos(getVideosByCategory());
    
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

  // Function to fetch YouTube videos
  const fetchYouTubeVideos = useCallback(async (pageToken?: string, queryIndex?: number) => {
    try {
      const params = new URLSearchParams();
      if (pageToken) {
        params.append("pageToken", pageToken);
      }
      if (queryIndex !== undefined) {
        params.append("queryIndex", queryIndex.toString());
      }
      
      const response = await fetch(`/api/youtube/home?${params.toString()}`);
      
      if (!response.ok) {
        console.warn("YouTube API error:", response.status, response.statusText);
        // Fallback to local videos tagged as YouTube
        const fallbackVideos = localVideos.filter(v => (v.platform || '').toLowerCase() === 'youtube');
        return {
          items: fallbackVideos,
          nextPageToken: null,
          nextQueryIndex: 0
        };
      }
      
      const data = await response.json();
      
      // Check if we got an error response from the API
      if (data.error) {
        console.warn("YouTube API returned error:", data.error);
        const fallbackVideos = localVideos.filter(v => (v.platform || '').toLowerCase() === 'youtube');
        return {
          items: fallbackVideos,
          nextPageToken: null,
          nextQueryIndex: 0
        };
      }
      
      const formattedVideos = data.videos.map((video: any) => ({
        id: video.id,
        title: video.title,
        thumbnail: video.thumbnail,
        uploader: video.channelTitle,
        views: video.viewCount,
        uploadDate: video.publishedAt,
        duration: video.duration,
        platform: "youtube",
        category: "youtube",
        likes: "0",
        comments: "0",
        url: `https://www.youtube.com/watch?v=${video.id}`,
        description: ""
      }));
      
      return {
        items: formattedVideos,
        nextPageToken: data.nextPageToken,
        nextQueryIndex: data.nextQueryIndex
      };
    } catch (error) {
      console.warn("Error fetching YouTube videos:", error);
      const fallbackVideos = localVideos.filter(v => (v.platform || '').toLowerCase() === 'youtube');
      return {
        items: fallbackVideos,
        nextPageToken: null,
        nextQueryIndex: 0
      };
    }
  }, []);
  
  // Function to fetch programming videos (mix of YouTube and local)
  const fetchProgrammingVideos = useCallback(async (pageToken?: string, queryIndex?: number) => {
    try {
      // Get programming-related local videos (exclude shorts)
      const programmingLocalVideos = localVideos.filter(video => 
        (video.category.toLowerCase().includes("programming") || 
        video.category.toLowerCase().includes("patterns") || 
        video.category.toLowerCase().includes("flowcharts") ||
        video.category.toLowerCase().includes("algorithms") ||
        video.category.toLowerCase().includes("data structure") ||
        video.category.toLowerCase().includes("number systems") ||
        video.category.toLowerCase().includes("sorting") ||
        video.category.toLowerCase().includes("search") ||
        video.category.toLowerCase().includes("tree") ||
        video.category.toLowerCase().includes("graph")) &&
        // Filter out shorts
        video.isShort !== true
      );
      
      // Fetch YouTube videos with expanded query scope
      const params = new URLSearchParams();
      if (pageToken) {
        params.append("pageToken", pageToken);
      }
      if (queryIndex !== undefined) {
        params.append("queryIndex", queryIndex.toString());
      }
      
      // Increase results per page to get more diverse content
      params.append("maxResults", "16"); // Request more videos per page
      
      const response = await fetch(`/api/youtube/programming?${params.toString()}`);
      
      if (!response.ok) {
        console.error("Programming API error:", response.status, response.statusText);
        // If API fails, return just the local videos
        return {
          items: programmingLocalVideos,
          nextPageToken: null,
          nextQueryIndex: 0
        };
      }
      
      const data = await response.json();
      
      // Check if we got an error response from the API
      if (data.error) {
        console.error("Programming API returned error:", data.error);
        return {
          items: programmingLocalVideos,
          nextPageToken: null,
          nextQueryIndex: 0
        };
      }
      
      const formattedYouTubeVideos = data.videos.map((video: any) => ({
        id: video.id,
        title: video.title,
        thumbnail: video.thumbnail,
        uploader: video.channelTitle,
        views: video.viewCount,
        uploadDate: video.publishedAt,
        duration: video.duration,
        platform: "youtube",
        category: video.category || "programming", // Use category if available
        likes: "0",
        comments: "0",
        url: `https://www.youtube.com/watch?v=${video.id}`,
        description: ""
      }));
      
      // Combine local and YouTube videos with duplicated local videos
      let combinedVideos = [];
      if (!pageToken) {
        // Create a more thorough mix of local and YouTube videos
        
        // First, shuffle the local videos
        const shuffledLocalVideos = [...programmingLocalVideos];
        for (let i = shuffledLocalVideos.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledLocalVideos[i], shuffledLocalVideos[j]] = [shuffledLocalVideos[j], shuffledLocalVideos[i]];
        }
        
        // Then, shuffle the YouTube videos
        const shuffledYouTubeVideos = [...formattedYouTubeVideos];
        for (let i = shuffledYouTubeVideos.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledYouTubeVideos[i], shuffledYouTubeVideos[j]] = [shuffledYouTubeVideos[j], shuffledYouTubeVideos[i]];
        }
        
        // Duplicate local videos to increase their presence
        // Each local video will appear 1-2 times
        let duplicatedLocalVideos: Video[] = [];
        shuffledLocalVideos.forEach(video => {
          // Add each video 1-2 times
          const duplicateCount = Math.floor(Math.random() * 2) + 1; // Random number between 1-2
          for (let i = 0; i < duplicateCount; i++) {
            // Create a new object with a slightly modified ID to avoid React key issues
            duplicatedLocalVideos.push({
              ...video,
              id: `${video.id}-dup-${i}`
            });
          }
        });
        
        // Shuffle the duplicated local videos again
        for (let i = duplicatedLocalVideos.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [duplicatedLocalVideos[i], duplicatedLocalVideos[j]] = [duplicatedLocalVideos[j], duplicatedLocalVideos[i]];
        }
        
        // Determine how many videos to take from each source
        // We want more YouTube videos than local videos
        const youtubeRatio = 0.8; // 80% YouTube videos
        const localRatio = 0.2;   // 20% local videos
        
        const totalDesiredVideos = Math.min(50, shuffledYouTubeVideos.length + duplicatedLocalVideos.length);
        const desiredYoutubeCount = Math.floor(totalDesiredVideos * youtubeRatio);
        const desiredLocalCount = Math.floor(totalDesiredVideos * localRatio);
        
        // Take the desired number of videos from each source
        const selectedYoutubeVideos = shuffledYouTubeVideos.slice(0, desiredYoutubeCount);
        const selectedLocalVideos = duplicatedLocalVideos.slice(0, desiredLocalCount);
        
        // Combine both arrays
        const allVideos = [...selectedYoutubeVideos, ...selectedLocalVideos];
        
        // Thoroughly shuffle the combined array to ensure random distribution
        for (let i = allVideos.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [allVideos[i], allVideos[j]] = [allVideos[j], allVideos[i]];
        }
        
        combinedVideos = allVideos;
      } else {
        // For subsequent pages, prioritize YouTube videos
        combinedVideos = formattedYouTubeVideos;
      }
      
      return {
        items: combinedVideos,
        nextPageToken: data.nextPageToken,
        nextQueryIndex: data.nextQueryIndex
      };
    } catch (error) {
      console.error("Error fetching programming videos:", error);
      
      // If API fails, return just the local videos (exclude shorts)
      const programmingLocalVideos = localVideos.filter(video => 
        (video.category.toLowerCase().includes("programming") || 
        video.category.toLowerCase().includes("patterns") || 
        video.category.toLowerCase().includes("flowcharts") ||
        video.category.toLowerCase().includes("algorithms") ||
        video.category.toLowerCase().includes("data structure") ||
        video.category.toLowerCase().includes("number systems")) &&
        // Filter out shorts
        video.isShort !== true
      );
      
      return {
        items: programmingLocalVideos,
        nextPageToken: null,
        nextQueryIndex: 0
      };
    }
  }, []);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Featured video card component to avoid type issues
  const FeaturedVideoCard = ({ video, priority }: { video: Video, priority?: boolean }) => (
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
          priority={priority}
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
            {formatViewCount(video.views)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            {formatPublishedDate(video.uploadDate)}
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
        <p className="text-xs text-muted-foreground mb-1">{video.uploader}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {formatViewCount(video.views)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatPublishedDate(video.uploadDate)}
          </span>
        </div>
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
        
        {/* Featured section with large cards - displayed in original order from data.ts */}
        <div className="mb-6 sm:mb-10">
          <div className="flex items-center justify-between mb-4 sm:mb-6 px-2 sm:px-0">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Featured Content</h2>
              <p className="text-xs text-muted-foreground mt-1">First 5 videos from the library</p>
            </div>
            <Button 
              variant="ghost" 
              className="text-xs sm:text-sm text-primary"
              onClick={() => router.push('/featured')}
            >
              View all
            </Button>
          </div>
          
          <ScrollArea className="w-full whitespace-nowrap pb-4">
            <div className="flex space-x-4 px-2 sm:px-0">
              {featuredVideos.map((video, idx) => (
                <FeaturedVideoCard key={`featured-${video.id}`} video={video} priority={idx === 0} />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        
        {/* Programming Videos Section */}
        <div className="mb-6 sm:mb-10">
          <div className="flex items-center justify-between mb-4 sm:mb-6 px-2 sm:px-0">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                <Code className="h-6 w-6" />
                Core Programming & Algorithms
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Tutorials on Algorithms, Data Structures, Math & Programming Concepts
              </p>
            </div>
            <Button 
              variant="ghost" 
              className="text-xs sm:text-sm text-primary"
              onClick={() => router.push('/category/programming')}
            >
              View all
            </Button>
          </div>
          
          <div className="px-2 sm:px-0">
            <InfiniteVideoGrid 
              fetchVideos={fetchProgrammingVideos} 
              batchSize={12} 
              className="mb-8"
            />
          </div>
        </div>
        
        {/* YouTube Videos / Local Videos Tabs */}
        <div className="mt-8 mb-6">
          <Tabs defaultValue="youtube" onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">Explore More</h2>
                <p className="text-xs text-muted-foreground mt-1">Discover videos from YouTube and local sources</p>
              </div>
              <TabsList>
                <TabsTrigger value="youtube">YouTube</TabsTrigger>
                <TabsTrigger value="local">Local</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="youtube" className="mt-0">
              <InfiniteVideoGrid fetchVideos={fetchYouTubeVideos} batchSize={12} />
            </TabsContent>
            
            <TabsContent value="local" className="mt-0">
              {/* Category sections with improved alignment */}
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
