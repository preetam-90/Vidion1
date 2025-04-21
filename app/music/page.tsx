"use client"

import { ListPlus } from 'lucide-react'; // Import ListPlus for Queue icon
// Add a placeholder Video type if not defined elsewhere
// Assuming a basic Video type structure based on usage
type Video = {
  id: string;
  title: string;
  thumbnail: string;
  uploader: string;
  views: string | number; // Allow both string and number
  uploadDate: string;
  duration?: string; // Make optional as shorts might not have it
  description?: string;
  platform?: string;
  category?: string;
  likes?: string | number;
  comments?: string | number;
  url: string;
};

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
// Removed MusicVideoCard import as it's not used
// import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'; // Removed as custom observer is used
import { APIKeyManager, createAPIKeyManager } from '@/lib/youtube-api';
import Image from 'next/image';
import { PlayCircle, Bookmark, Share2, MoreVertical, Share, Clock, Flag, Music, Film } from 'lucide-react'; // Added Film icon
import { useWatchLater } from '@/contexts/watch-later-context';
import { useToast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SharePopup from '@/components/share-popup';
// Remove the VideoCard import since we have our own implementation in this file

// Mock data for when API fails
const MOCK_MUSIC_VIDEOS: Video[] = [
  {
    id: 'mock-1',
    title: 'Animal: Arjan Vailly | Ranbir Kapoor | Sandeep Vanga | B Praak | Manan Bhardwaj | Bhushan K',
    thumbnail: 'https://i.ytimg.com/vi/YxWlaYCA8MU/maxresdefault.jpg',
    uploader: 'T-Series',
    views: '100M',
    uploadDate: '2 weeks ago',
    description: 'Official music video for Arjan Vailly from Animal',
    platform: 'youtube',
    category: 'music',
    likes: '2.1M',
    comments: '150K',
    url: 'https://www.youtube.com/watch?v=YxWlaYCA8MU',
    duration: '3:21'
  },
  {
    id: 'mock-2',
    title: 'Dunki: O Maahi | Shah Rukh Khan | Pritam | Arijit Singh | Irshad Kamil',
    thumbnail: 'https://i.ytimg.com/vi/szvt1vD0Uug/maxresdefault.jpg',
    uploader: 'Sony Music India',
    views: '50M',
    uploadDate: '1 week ago',
    description: 'Official music video for O Maahi from Dunki',
    platform: 'youtube',
    category: 'music',
    likes: '1.5M',
    comments: '100K',
    url: 'https://www.youtube.com/watch?v=szvt1vD0Uug',
    duration: '4:15'
  },
  {
    id: 'mock-3',
    title: 'Satranga (From "ANIMAL") | Ranbir Kapoor, Rashmika M | Sandeep V | Arijit Singh | Shreyas P',
    thumbnail: 'https://i.ytimg.com/vi/u0Y3EHuMktE/maxresdefault.jpg',
    uploader: 'T-Series',
    views: '75M',
    uploadDate: '3 weeks ago',
    description: 'Official music video for Satranga from Animal',
    platform: 'youtube',
    category: 'music',
    likes: '1.8M',
    comments: '120K',
    url: 'https://www.youtube.com/watch?v=u0Y3EHuMktE',
    duration: '4:45'
  }
];

// Maximum number of videos to load
const MAX_VIDEOS = 70;
// Initial batch size
const INITIAL_BATCH_SIZE = 15;
// Subsequent batch size for loading videos when scrolling
const SCROLL_BATCH_SIZE = 4;

// Removed unused MusicVideo interface and musicVideos array

export default function MusicPage() {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [pageToken, setPageToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [keyManager] = useState(() => createAPIKeyManager());
  const { addToWatchLater, removeFromWatchLater, isInWatchLater } = useWatchLater();
  const { toast } = useToast();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const lastVideoRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  // Map to track visible cards
  const [visibleCards, setVisibleCards] = useState<{[id: string]: boolean}>({});
  // Track total videos loaded
  const [totalVideosLoaded, setTotalVideosLoaded] = useState(0);
  // Track if this is the initial load
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  const handleVideoClick = useCallback((video: Video) => {
    sessionStorage.setItem('currentVideo', JSON.stringify(video));
    router.push(`/video/${video.id}`);
  }, [router]);

  const fetchVideos = useCallback(async (nextPageToken?: string) => {
    if (!nextPageToken) {
      setIsLoading(true);
    } else {
      console.log("Loading more videos with token:", nextPageToken);
    }
    
    // Check if we've already reached the maximum number of videos
    if (totalVideosLoaded >= MAX_VIDEOS) {
      setHasMore(false);
      setIsLoading(false);
      return;
    }
    
    try {
      // Log available API keys before making request
      console.log('Starting fetch with API key manager...');
      
      const data = await keyManager.executeWithQuota(async (apiKey) => {
        if (!apiKey) {
          console.error('No API key available for YouTube request');
          throw new Error('No API key available');
        }

        console.log('Using API key: ' + apiKey.substring(0, 5) + '...');

        // Determine batch size based on whether this is the initial load
        const batchSize = isInitialLoad ? INITIAL_BATCH_SIZE : SCROLL_BATCH_SIZE;

        const params = new URLSearchParams({
          part: 'snippet,statistics,contentDetails',
          chart: 'mostPopular',
          regionCode: 'IN',
          videoCategoryId: '10', // Music category
          maxResults: String(batchSize), // Either 15 for initial or 4 for scrolling
          key: apiKey,
          ...(nextPageToken ? { pageToken: nextPageToken } : {}),
        });

        console.log(`Fetching ${batchSize} videos from YouTube API...`);

        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?${params}`,
          {
            headers: {
              'Accept': 'application/json',
            },
            cache: 'no-store'
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('YouTube API Error:', {
            status: response.status,
            statusText: response.statusText,
            error: errorData,
            url: response.url.replace(/key=([^&]+)/, 'key=REDACTED') // Log URL without exposing API key
          });
          throw new Error(`Failed to fetch videos (status: ${response.status})`);
        }

        const jsonData = await response.json();
        return jsonData;
      }, 100);

      if (!data?.items?.length) {
        console.log('No videos returned from API, using mock data');
        if (!nextPageToken && videos.length === 0) { // Only on initial load failure
            setVideos(MOCK_MUSIC_VIDEOS); // Keep mock music videos separate
            setTotalVideosLoaded(MOCK_MUSIC_VIDEOS.length);
        }
        setHasMore(false); // No more pages to fetch
        return;
      }

      const newVideos: Video[] = data.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.maxres?.url ||
                  item.snippet.thumbnails.high?.url ||
                  item.snippet.thumbnails.medium?.url ||
                  '/placeholder.jpg',
        uploader: item.snippet.channelTitle,
        views: formatViewCount(parseInt(item.statistics?.viewCount || '0')),
        uploadDate: formatTimeAgo(item.snippet.publishedAt),
        duration: formatDuration(item.contentDetails?.duration || ''),
        description: item.snippet.description,
        platform: 'youtube',
        category: 'music',
        likes: formatViewCount(parseInt(item.statistics?.likeCount || '0')),
        comments: formatViewCount(parseInt(item.statistics?.commentCount || '0')),
        url: `https://www.youtube.com/watch?v=${item.id}`
      }));

      // Calculate how many videos we'll have after this update
      const nextTotalVideos = totalVideosLoaded + newVideos.length;
      
      // If we'll exceed the maximum, slice the array to fit exactly
      let videosToAdd = newVideos;
      if (nextTotalVideos > MAX_VIDEOS) {
        videosToAdd = newVideos.slice(0, MAX_VIDEOS - totalVideosLoaded);
        setHasMore(false); // We've reached the limit
      } else {
        // Update the page token only if we're not at the limit
        setPageToken(data.nextPageToken || null);
        // Set hasMore to false if no nextPageToken or if we're at the limit
        setHasMore(!!data.nextPageToken && nextTotalVideos < MAX_VIDEOS);
      }

      // Log for debugging
      console.log(`Adding ${videosToAdd.length} new videos. Has more: ${!!data.nextPageToken}, Next token: ${data.nextPageToken || 'none'}`);

      setVideos(prev => nextPageToken ? [...prev, ...videosToAdd] : videosToAdd);
      setTotalVideosLoaded(prev => prev + videosToAdd.length);
      
      // Set isInitialLoad to false after first fetch
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
      
    } catch (error) {
      console.error('Error fetching videos:', error);
      // Only set mock data if it's the initial fetch and videos array is empty
      if (!nextPageToken && videos.length === 0) {
        console.log('Setting mock music videos due to error');
        setVideos(MOCK_MUSIC_VIDEOS); // Set regular mock videos
        setTotalVideosLoaded(MOCK_MUSIC_VIDEOS.length);
      }
      setHasMore(false);
      toast({
        title: "Error loading videos",
        description: "Could not load trending videos. Using mock data.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [keyManager, toast, totalVideosLoaded, videos.length, isInitialLoad]);

  // Helper functions for formatting
  const formatViewCount = (count: number | string): string => { // Accept string as well
    const num = typeof count === 'string' ? parseInt(count.replace(/[^0-9]/g, ''), 10) : count;
    if (isNaN(num)) return '0';
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(1).replace('.0', '')}B`;
    }
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1).replace('.0', '')}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1).replace('.0', '')}K`;
    }
    return num.toString();
  };

  const formatTimeAgo = (date: string): string => {
    try {
      const now = new Date();
      const videoDate = new Date(date);
      if (isNaN(videoDate.getTime())) return ''; // Handle invalid date
      const diffTime = Math.abs(now.getTime() - videoDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const diffMonths = Math.floor(diffDays / 30);
      const diffYears = Math.floor(diffDays / 365);

      if (diffYears > 0) return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
      if (diffMonths > 0) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
      if (diffDays > 1) return `${diffDays} days ago`;
       if (diffDays === 1) return `1 day ago`;
      // Add hours/minutes if needed
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
       if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
       if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
      return 'Just now';
    } catch (e) {
      console.error("Error formatting time:", e);
      return ''; // Return empty string on error
    }
  };

  const formatDuration = (duration: string): string => {
    if (!duration) return '0:00';
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '0:00';
    
    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const seconds = match[3] ? parseInt(match[3]) : 0;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Lazy loading observer
  useEffect(() => {
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const videoId = entry.target.getAttribute('data-video-id');
        if (videoId) {
          setVisibleCards(prev => ({
            ...prev,
            [videoId]: entry.isIntersecting
          }));
        }
      });
    }, {
      rootMargin: '200px', // Start loading when card is 200px from viewport
      threshold: 0.1 // Trigger when at least 10% of the item is visible
    });
    
    // Get all video cards
    const cards = document.querySelectorAll('.video-card');
    cards.forEach(card => cardObserver.observe(card));
    
    return () => {
      cards.forEach(card => cardObserver.unobserve(card));
      cardObserver.disconnect();
    };
  }, [videos]); // Re-run when videos array changes

  // Infinite scroll observer
  useEffect(() => {
    if (!observerRef.current) {
      const observerCallback = (entries: IntersectionObserverEntry[]) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          console.log("Intersection observer triggered!", {
            hasMore,
            isLoading,
            pageToken,
            totalVideosLoaded
          });
          
          // If we're not at the limit and not currently loading, fetch more videos
          if (totalVideosLoaded < MAX_VIDEOS) {
            if (pageToken) {
              console.log("Fetching more videos with pageToken:", pageToken);
              fetchVideos(pageToken);
            } else {
              console.log("No pageToken available, but should load more videos");
              // If we have no pageToken but need more videos, try fetching without token
              if (videos.length < INITIAL_BATCH_SIZE && totalVideosLoaded < MAX_VIDEOS) {
                fetchVideos();
              }
            }
          }
        }
      };

      observerRef.current = new IntersectionObserver(observerCallback, {
        threshold: 0.1, // Lower threshold to trigger earlier
        rootMargin: '300px' // Increased - load when last element is 300px from viewport
      });
    }

    // Disconnect and recreate observer when dependencies change
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [hasMore, isLoading, pageToken, fetchVideos, totalVideosLoaded, videos.length]);

  // Observe last video element
  useEffect(() => {
    const currentObserver = observerRef.current;
    const lastElement = lastVideoRef.current;

    if (currentObserver && lastElement) {
      console.log("Observing last video element:", lastElement);
      currentObserver.observe(lastElement);
      
      return () => {
        if (lastElement) {
          console.log("Unobserving last video element:", lastElement);
          currentObserver.unobserve(lastElement);
        }
      };
    } else {
      console.log("Observer or last element not ready for observation:", { 
        hasObserver: !!currentObserver, 
        hasLastElement: !!lastElement,
        videosCount: videos.length
      });
    }
  }, [videos, hasMore, isLoading]); // Added hasMore and isLoading as dependencies

  // Initial fetch
  useEffect(() => {
    if (videos.length === 0) { // Only fetch initially if videos are empty
        console.log("Initial fetch triggered.");
        fetchVideos();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchVideos]); // Depend on fetchVideos only - Disabled eslint warning for deps


  // Component for rendering a single video card (regular video)
  const VideoCard = ({ video, isLast }: { video: Video, isLast: boolean }) => {
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      // Only set up visibility observer for non-last elements
      // Last element already has the lastVideoRef for infinite scrolling
      if (!isLast) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            setIsVisible(entry.isIntersecting);
          },
          {
            rootMargin: '200px',
            threshold: 0.1
          }
        );

        if (cardRef.current) {
          observer.observe(cardRef.current);
        }

        return () => {
          if (cardRef.current) {
            observer.unobserve(cardRef.current);
          }
        };
      } else {
        // If this is the last element, make it visible by default 
        // This ensures it's visible for the infinite scroll observer
        setIsVisible(true);
      }
    }, [isLast]);

    // For debugging purposes
    useEffect(() => {
      if (isLast) {
        console.log(`Last video card rendered: ${video.id}`);
      }
    }, [isLast, video.id]);

    return (
      <div
        className="flex flex-col space-y-2 group cursor-pointer video-card"
        onClick={() => handleVideoClick(video)}
        ref={isLast ? lastVideoRef : cardRef}
        data-video-id={video.id}
        data-is-last={isLast ? "true" : "false"}
      >
        <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-800">
          {/* Only render image if the card is visible or has been visible before */}
          {isVisible && (
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
            />
          )}
          {!isVisible && (
            <div className="absolute inset-0 bg-gray-700 animate-pulse">
              <div className="h-full w-full flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-gray-600 border-t-gray-400 rounded-full animate-spin"></div>
              </div>
            </div>
          )}
          
          {video.duration && isVisible && (
            <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[11px] md:text-[13px] text-white z-10">
              {video.duration}
            </div>
          )}
          {/* Hover icons: Watch Later & Add to Queue (only show when visible) */}
          {isVisible && (
            <div className="absolute top-2 right-2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click
                  // Add Watch Later Logic
                  const isIn = isInWatchLater(video.id);
                  if (isIn) {
                    removeFromWatchLater(video.id);
                    toast({ description: "Removed from Watch Later", duration: 2000 });
                  } else {
                    addToWatchLater({
                      ...video,
                      description: video.description ?? '',
                      views: typeof video.views === 'string' ? parseInt(video.views.replace(/[^0-9]/g, '')) : (video.views ?? 0),
                      likes: video.likes ?? 0,
                      comments: video.comments ?? 0,
                      platform: video.platform ?? '',
                      category: video.category ?? ''
                    });
                    toast({ description: "Added to Watch Later", duration: 2000 });
                  }
                }}
                className="p-1.5 bg-black/70 hover:bg-black/90 rounded text-white"
                aria-label={isInWatchLater(video.id) ? "Remove from Watch Later" : "Save to Watch Later"}
              >
                <Clock size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click
                  // Add Queue Logic (placeholder)
                  toast({ description: "Added to queue (placeholder)", duration: 2000 });
                }}
                className="p-1.5 bg-black/70 hover:bg-black/90 rounded text-white"
                aria-label="Add to queue"
              >
                <ListPlus size={18} />
              </button>
            </div>
          )}
        </div>
        <div className="flex items-start">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-sm md:text-[15px] leading-snug line-clamp-2 mb-1">
              {video.title}
            </h3>
            <p className="text-xs md:text-[13px] text-gray-400 line-clamp-1 mb-0.5">{video.uploader}</p>
            <div className="flex items-center text-xs md:text-[13px] text-gray-300 flex-wrap gap-x-1.5">
              <span className="font-medium">{formatViewCount(video.views)} views</span>
              <span>•</span>
              <span className="font-medium">{video.uploadDate}</span>
            </div>
          </div>
          {isVisible && (
            <div onClick={(e) => e.stopPropagation()} className="ml-auto flex-shrink-0 self-start pt-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1 -mr-1 text-gray-400 hover:text-white hover:bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-zinc-800 border-zinc-700 text-white">
                  <DropdownMenuItem className="hover:bg-zinc-700 focus:bg-zinc-700" onClick={() => {
                    setSelectedVideo(video);
                    setIsShareOpen(true);
                  }}>
                    <Share className="mr-2 h-4 w-4" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-zinc-700 focus:bg-zinc-700" onClick={() => {
                    // Watch Later Logic
                    const isIn = isInWatchLater(video.id);
                    if (isIn) {
                      removeFromWatchLater(video.id);
                      toast({ description: "Removed from Watch Later", duration: 2000 });
                    } else {
                      // Ensure description, likes, comments, platform, and category are defined or provide defaults
                      addToWatchLater({
                        ...video,
                        description: video.description ?? '',
                        views: typeof video.views === 'string' ? parseInt(video.views.replace(/[^0-9]/g, '')) : (video.views ?? 0),
                        likes: video.likes ?? 0,
                        comments: video.comments ?? 0,
                        platform: video.platform ?? '',
                        category: video.category ?? '' // Provide default empty string
                      });
                      toast({ description: "Added to Watch Later", duration: 2000 });
                    }
                  }}>
                    <Clock className="mr-2 h-4 w-4" />
                    {isInWatchLater(video.id) ? 'Remove from Watch Later' : 'Save to Watch Later'}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-zinc-700 focus:bg-zinc-700" onClick={() => {/* Report Logic */}}>
                    <Flag className="mr-2 h-4 w-4" />
                    Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white px-4 sm:px-6 lg:px-8 py-6">
        {/* Video count and loading status indicator */}
        <div className="mb-6 flex justify-between items-center">
          {(isLoading && videos.length > 0) && (
            <div className="flex items-center text-sm text-gray-400">
              <div className="mr-2 w-4 h-4 border-2 border-gray-500 border-t-white rounded-full animate-spin"></div>
              Loading more videos...
            </div>
          )}
        </div>
        
        {/* Initial Loading State */}
        {isLoading && videos.length === 0 && (
             <div className="fixed inset-0 flex justify-center items-center bg-black/80 z-50">
               <div className="flex flex-col items-center gap-4">
                 <div className="animate-spin rounded-full h-12 w-12 border-2 border-white border-t-transparent" />
                 <p className="text-white text-sm">Loading videos...</p>
               </div>
             </div>
        )}

        {/* No Videos Message */}
         { !isLoading && videos.length === 0 && (
             <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center">
                 <Music className="w-16 h-16 text-red-500 mb-4" />
                 <h2 className="text-xl font-semibold mb-2">No Videos Available</h2>
                 <p className="text-gray-400 mb-4">Could not load any videos at the moment.</p>
                 <button
                   onClick={() => { setIsInitialLoad(true); setIsLoading(true); fetchVideos(); }} // Reset to initial load
                   className="bg-white hover:bg-white/90 text-black px-6 py-2 rounded-full transition-colors text-sm font-medium"
                 >
                   Try Again
                 </button>
            </div>
         )}

        {/* Render all videos if available */}
        {videos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
                {videos.map((video, index) => (
                    <VideoCard 
                        key={`${video.id}-${index}`} 
                        video={video} 
                        isLast={index === videos.length - 1}
                    />
                ))}
            </div>
        )}

        {/* No more videos message */}
        {(!isLoading && !hasMore && videos.length > 0) || videos.length >= MAX_VIDEOS && (
             <div className="text-center py-8 mt-6">
               <p className="text-gray-400">You've reached the end!</p>
             </div>
        )}

        {/* Share popup */}
        {isShareOpen && selectedVideo && (
             <SharePopup
                 isOpen={isShareOpen}
                 url={`${typeof window !== 'undefined' ? window.location.origin : ''}/video/${selectedVideo.id}`}
                 title={selectedVideo.title}
                 onClose={() => setIsShareOpen(false)}
             />
         )}
    </div>
  );
}

// Define or import necessary types/components used above if they aren't already:
// - @/types/data -> Define basic Video type inline for now
// - @/lib/youtube-api -> Assume functions exist
// - @/contexts/watch-later-context -> Assume hooks exist
// - @/components/ui/use-toast -> Assume hook exists
// - @/components/ui/dropdown-menu -> Assume components exist
// - @/components/share-popup -> Assume component exists