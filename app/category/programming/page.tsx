"use client"

import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { useWatchLater } from '@/contexts/watch-later-context'
import SharePopup from '@/components/share-popup'
import { InfiniteVideoGrid } from '@/components/video-grid'
import { Code } from 'lucide-react'

// Simple Video type
type Video = {
  id: string;
  title: string;
  thumbnail: string;
  uploader: string;
  views: string | number;
  uploadDate: string;
  duration?: string;
  description?: string;
  platform?: string;
  category?: string;
  likes?: string | number;
  comments?: string | number;
  url: string;
};

export default function ProgrammingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { addToWatchLater, removeFromWatchLater, isInWatchLater } = useWatchLater();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  // Function to fetch programming videos (mix of YouTube and local)
  const fetchProgrammingVideos = useCallback(async (pageToken?: string, queryIndex?: number) => {
    try {
      // Import local videos
      const { videos: localVideos } = await import('@/data');
      
      // Get programming-related local videos (exclude shorts)
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
      
      // Fetch YouTube videos
      const params = new URLSearchParams();
      if (pageToken) {
        params.append("pageToken", pageToken);
      }
      if (queryIndex !== undefined) {
        params.append("queryIndex", queryIndex.toString());
      }
      
      const response = await fetch(`/api/youtube/programming?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch programming videos");
      }
      
      const data = await response.json();
      
      const formattedYouTubeVideos = data.videos.map((video: any) => ({
        id: video.id,
        title: video.title,
        thumbnail: video.thumbnail,
        uploader: video.channelTitle,
        views: video.viewCount,
        uploadDate: video.publishedAt,
        duration: video.duration,
        platform: "youtube",
        category: "programming",
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
        // Each local video will appear 2-3 times
        let duplicatedLocalVideos = [];
        shuffledLocalVideos.forEach(video => {
          // Add each video 2-3 times
          const duplicateCount = Math.floor(Math.random() * 2) + 2; // Random number between 2-3
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
        const youtubeRatio = 0.7; // 70% YouTube videos
        const localRatio = 0.3;   // 30% local videos
        
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
        // For subsequent pages, mix in some local videos with YouTube videos
        const shuffledYouTubeVideos = [...formattedYouTubeVideos];
        
        // If we have local videos, duplicate and mix some in
        if (programmingLocalVideos.length > 0) {
          // Shuffle local videos
          const shuffledLocalVideos = [...programmingLocalVideos];
          for (let i = shuffledLocalVideos.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledLocalVideos[i], shuffledLocalVideos[j]] = [shuffledLocalVideos[j], shuffledLocalVideos[i]];
          }
          
          // Take a few random local videos (about 20% of the page size)
          const localVideoCount = Math.ceil(shuffledYouTubeVideos.length * 0.2);
          const selectedLocalVideos = [];
          
          // Select random local videos with duplication
          for (let i = 0; i < localVideoCount; i++) {
            const randomIndex = Math.floor(Math.random() * shuffledLocalVideos.length);
            const video = shuffledLocalVideos[randomIndex];
            // Create a new object with a slightly modified ID to avoid React key issues
            selectedLocalVideos.push({
              ...video,
              id: `${video.id}-dup-${i}-${Date.now()}`
            });
          }
          
          // Mix the local videos into random positions in the YouTube videos
          selectedLocalVideos.forEach(video => {
            const insertPosition = Math.floor(Math.random() * (shuffledYouTubeVideos.length + 1));
            shuffledYouTubeVideos.splice(insertPosition, 0, video);
          });
        }
        
        combinedVideos = shuffledYouTubeVideos;
      }
      
      return {
        items: combinedVideos,
        nextPageToken: data.nextPageToken,
        nextQueryIndex: data.nextQueryIndex
      };
    } catch (error) {
      console.error("Error fetching programming videos:", error);
      
      try {
        // If API fails, return just the local videos (exclude shorts)
        const { videos: localVideos } = await import('@/data');
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
      } catch (importError) {
        console.error("Error importing local videos:", importError);
        return {
          items: [],
          nextPageToken: null,
          nextQueryIndex: 0
        };
      }
    }
  }, []);

  // Function to handle video share
  const handleShare = (video: Video) => {
    setSelectedVideo(video);
    setIsShareOpen(true);
  };

  return (
    <div className="container mx-auto px-0 sm:px-4 py-4 sm:py-8">
      <div className="flex items-center justify-between mb-4 sm:mb-6 px-2 sm:px-0">
        <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <Code className="h-6 w-6" />
          Programming
        </h1>
      </div>
      
      <InfiniteVideoGrid 
        fetchVideos={fetchProgrammingVideos} 
        batchSize={12} 
      />
      
      {isShareOpen && selectedVideo && (
        <SharePopup
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          url={selectedVideo.url || `https://youtube.com/watch?v=${selectedVideo.id}`}
          title={selectedVideo.title}
        />
      )}
    </div>
  );
}