"use client";

import { useEffect, useState, Suspense } from "react";
import { useWatchLater } from "@/contexts/watch-later-context";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, SkipForward, Shuffle, ThumbsUp, ThumbsDown, Share2 } from "lucide-react";
import VideoPlayer from "@/components/video-player";

export default function PlayerPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <PlayerContent />
    </Suspense>
  );
}

function PlayerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { watchLaterVideos } = useWatchLater();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShuffleMode, setIsShuffleMode] = useState(false);
  const [playedIndices, setPlayedIndices] = useState<number[]>([]);
  const [currentVideo, setCurrentVideo] = useState<any>(null);

  // Initialize player state from URL parameters and get video data
  useEffect(() => {
    // Get video from sessionStorage
    const storedVideo = sessionStorage.getItem('currentVideo');
    if (storedVideo) {
      try {
        const parsedVideo = JSON.parse(storedVideo);
        setCurrentVideo(parsedVideo);
        return;
      } catch (error) {
        console.error('Error parsing stored video:', error);
      }
    }
    
    if (videoId) {
      // Fallback if no stored video data
      const fallbackVideo = watchLaterVideos.find(video => video.id === videoId);
      if (fallbackVideo) {
        setCurrentVideo(fallbackVideo);
      } else {
        // If video not found in watch later, try to fetch from API
        fetch(`/api/youtube/videos?id=${videoId}`)
          .then(res => res.json())
          .then(data => {
            if (data.items && data.items.length > 0) {
              const videoData = data.items[0];
              setCurrentVideo({
                id: videoData.id,
                title: videoData.snippet.title,
                url: `https://www.youtube.com/watch?v=${videoData.id}`,
                platform: 'youtube',
                thumbnail: videoData.snippet.thumbnails.high?.url
              });
            }
          })
          .catch(err => {
            console.error('Error fetching video:', err);
            router.push('/');
          });
      }
    }
  }, [searchParams, videoId]);

  // Get video ID from URL if present (supports both 'v' and 'id' parameters)
  const videoId = searchParams.get("v") || searchParams.get("id");

  // Function to play next video in sequence
  const playNextVideo = () => {
    if (isShuffleMode) {
      // Get unplayed videos
      const unplayedIndices = watchLaterVideos
        .map((_, index) => index)
        .filter(index => !playedIndices.includes(index));

      if (unplayedIndices.length > 0) {
        // Play a random unplayed video
        const randomIndex = Math.floor(Math.random() * unplayedIndices.length);
        const nextIndex = unplayedIndices[randomIndex];
        setCurrentIndex(nextIndex);
        setPlayedIndices([...playedIndices, nextIndex]);
      } else {
        // All videos played, reset
        setPlayedIndices([]);
        const firstRandomIndex = Math.floor(Math.random() * watchLaterVideos.length);
        setCurrentIndex(firstRandomIndex);
        setPlayedIndices([firstRandomIndex]);
      }
    } else {
      // Sequential play
      if (currentIndex < watchLaterVideos.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // End of playlist, go back to watch later page
        router.push("/watch-later");
      }
    }
  };

  // Handle video end
  const handleVideoEnd = () => {
    playNextVideo();
  };

  if (!currentVideo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">No videos in watch later</h1>
        <Button onClick={() => router.push("/watch-later")}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <VideoPlayer video={currentVideo} onEnded={handleVideoEnd} />
      <div className="flex gap-4 mt-4">
        <Button onClick={() => router.push("/home")}>Home</Button>
        <Button onClick={playNextVideo}>Next</Button>
      </div>
    </div>
  );
}