"use client"

import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { useWatchLater } from '@/contexts/watch-later-context'
import SharePopup from '@/components/share-popup'
import { InfiniteVideoGrid } from '@/components/video-grid'
import { Music2 } from 'lucide-react'

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

export default function MusicPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { addToWatchLater, removeFromWatchLater, isInWatchLater } = useWatchLater();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  // Function to handle video click
  const handleVideoClick = useCallback((video: Video) => {
    sessionStorage.setItem('currentVideo', JSON.stringify(video));
    router.push(`/video/${video.id}`);
  }, [router]);

  // Helper function to format view counts
  const formatViewCount = useCallback((count: number | string): string => {
    const num = typeof count === 'string' ? parseInt(count.replace(/[^0-9]/g, ''), 10) : count;
    if (isNaN(num)) return '0';
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1).replace('.0', '')}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1).replace('.0', '')}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1).replace('.0', '')}K`;
    return num.toString();
  }, []);

  // Function to format ISO 8601 duration to readable format
  const formatDuration = (duration: string): string => {
    if (!duration) return "";
    
    // Parse the ISO 8601 duration format
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return "";
    
    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const seconds = match[3] ? parseInt(match[3]) : 0;
    
    // Format based on duration length
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  };

  // Function to fetch trending music videos from India
  const fetchMusicVideos = useCallback(async (pageToken?: string) => {
    try {
      // videoCategoryId=10 is for Music category in YouTube API
      const response = await fetch(`/api/youtube/trending?videoCategoryId=10&region=IN${pageToken ? `&pageToken=${pageToken}` : ''}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch music videos');
      }
      
      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        return { items: [], nextPageToken: null };
      }
      
      const formattedVideos = data.items.map((item: any) => ({
        id: item.id,
        title: item.title || item.snippet?.title || 'Untitled Video',
        thumbnail: item.thumbnail || (
          item.snippet?.thumbnails?.maxres?.url ||
          item.snippet?.thumbnails?.high?.url ||
          item.snippet?.thumbnails?.medium?.url ||
          '/placeholder-thumbnail.jpg'
        ),
        uploader: item.channelTitle || item.snippet?.channelTitle || 'Unknown Artist',
        views: item.viewCount || item.statistics?.viewCount || '0',
        uploadDate: item.publishedAt || item.snippet?.publishedAt || new Date().toISOString(),
        description: item.snippet?.description || '',
        platform: 'youtube',
        category: 'music',
        likes: item.statistics?.likeCount || '0',
        comments: item.statistics?.commentCount || '0',
        url: `https://www.youtube.com/watch?v=${item.id}`,
        duration: formatDuration(item.contentDetails?.duration || ''),
      }));
      
      return {
        items: formattedVideos,
        nextPageToken: data.nextPageToken || null
      };
    } catch (error) {
      console.error('Error fetching music videos:', error);
      return { items: [], nextPageToken: null };
    }
  }, [formatViewCount]);

  // Helper function for formatting dates
  const formatPublishedDate = (dateString: string): string => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 1) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
      return `${Math.floor(diffDays / 365)} years ago`;
    } catch (e) {
      return '';
    }
  };

  // Function to handle video share
  const handleShare = (video: Video) => {
    setSelectedVideo(video);
    setIsShareOpen(true);
  };

  return (
    <div className="container mx-auto px-0 sm:px-4 py-4 sm:py-8">
      <div className="flex items-center justify-between mb-4 sm:mb-6 px-2 sm:px-0">
        <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <Music2 className="h-6 w-6" />
          Trending Music Videos - India
        </h1>
      </div>
      
      <InfiniteVideoGrid 
        fetchVideos={fetchMusicVideos} 
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