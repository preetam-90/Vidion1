'use client';

import { useEffect, useState } from 'react';
import VideoCard from '@/components/video-card';
import type { Video } from '@/data';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function HistoryPage() {
  const [watchHistory, setWatchHistory] = useState<Video[]>([]);

  // Set page title
  usePageTitle("History");

  useEffect(() => {
    // Retrieve watch history from localStorage
    const history = localStorage.getItem('watchHistory');
    if (history) {
      try {
        const parsedHistory = JSON.parse(history);
        // Ensure unique videos by ID
        const uniqueHistory = parsedHistory.reduce((acc: Video[], video: Video) => {
          if (!acc.find(v => v.id === video.id)) {
            acc.push(video);
          }
          return acc;
        }, []);
        setWatchHistory(uniqueHistory);
      } catch (error) {
        console.error('Error parsing watch history:', error);
        setWatchHistory([]);
      }
    }
  }, []);

  const handleRemoveFromHistory = (videoId: string | number) => {
    const updatedHistory = watchHistory.filter((video) => video.id !== videoId);
    setWatchHistory(updatedHistory);
    localStorage.setItem('watchHistory', JSON.stringify(updatedHistory));
  };

  if (watchHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <h1 className="text-2xl font-semibold mb-2">No Watch History</h1>
        <p className="text-muted-foreground text-center">
          Videos you watch will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6">Watch History</h1>
      <div className="space-y-4">
        {watchHistory.map((video, index) => (
          <VideoCard
            key={`${video.id}-${index}`}
            video={video}
            layout="list"
            context="history"
            onRemoveFromHistory={handleRemoveFromHistory}
          />
        ))}
      </div>
    </div>
  );
}