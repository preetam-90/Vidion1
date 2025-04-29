"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLikedVideos } from '@/contexts/liked-videos-context';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Skeleton } from '@/components/ui/skeleton';
import VideoCard from '@/components/video-card';

// Use the same Video type or import it if defined elsewhere
interface Video {
  id: string;
  title: string;
  platform: 'youtube' | 'googleDrive';
  url?: string;
  channelTitle?: string;
  thumbnail?: string; // Add thumbnail if available/needed for display
  // Add other properties as needed for display
}

export default function FavoritesPage() {
  const { likedVideos } = useLikedVideos();
  const [isLoading, setIsLoading] = useState(true);

  // Set page title
  usePageTitle("Favorites");

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Favorites</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="aspect-video rounded-xl" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (likedVideos.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Favorites</h1>
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
          <p className="text-muted-foreground text-center">
            You haven't liked any videos yet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Favorites</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {likedVideos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onClick={() => {
              sessionStorage.setItem('currentVideo', JSON.stringify(video));
            }}
          />
        ))}
      </div>
    </div>
  );
} 