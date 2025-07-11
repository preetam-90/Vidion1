"use client"

import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { useWatchLater } from '@/contexts/watch-later-context'
import SharePopup from '@/components/share-popup'
import { InfiniteVideoGrid } from '@/components/video-grid'
import { Star } from 'lucide-react'

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

export default function FeaturedPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { addToWatchLater, removeFromWatchLater, isInWatchLater } = useWatchLater();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  // Function to fetch all local videos in their original order
  const fetchFeaturedVideos = useCallback(async () => {
    try {
      // Import local videos
      const { videos: localVideos } = await import('@/data');
      
      // Filter out shorts but maintain original order
      const nonShortVideos = localVideos.filter(video => video.isShort !== true);
      
      // Return videos in the original order they are stored in data.ts
      return {
        items: nonShortVideos,
        nextPageToken: null, // No pagination for local videos
        nextQueryIndex: 0
      };
    } catch (error) {
      console.error("Error fetching featured videos:", error);
      return {
        items: [],
        nextPageToken: null,
        nextQueryIndex: 0
      };
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
        <div>
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Star className="h-6 w-6" />
            Featured Content
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Videos displayed in their original order from the library</p>
        </div>
      </div>
      
      <InfiniteVideoGrid 
        fetchVideos={fetchFeaturedVideos} 
        batchSize={24} 
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