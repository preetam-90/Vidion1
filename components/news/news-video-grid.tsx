import React from 'react';
import { YouTubeVideo } from '@/lib/youtube-api';
import NewsVideoCard from './news-video-card';
import { Skeleton } from '@/components/ui/skeleton';

interface NewsVideoGridProps {
  videos: YouTubeVideo[];
  isLoading?: boolean;
}

const NewsVideoGrid: React.FC<NewsVideoGridProps> = ({ videos, isLoading = false }) => {
  // Show full page loading state when no videos and loading
  if (isLoading && videos.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array(8).fill(0).map((_, i) => (
          <div key={i} className="flex flex-col space-y-2">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-xl font-semibold mb-2">No news videos found</h3>
        <p className="text-gray-500">Please check back later for updates</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map((video) => (
          <NewsVideoCard key={video.id} video={video} />
        ))}
      </div>
    </>
  );
};

export default NewsVideoGrid;