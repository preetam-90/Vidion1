"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import type { Video as AppVideo, MovieCategory } from '@/types/data'
import MovieCarousel from "@/components/movie-carousel"
import VideoGrid from "@/components/video-grid"
import { fetchWithCache } from "@/lib/api"
import { videos as localVideos } from '@/data' // Import local fallback data

// Use the main Video type for consistency
interface Video extends AppVideo {}

// Helper function to check if content is long form (>10 minutes)
const isLongFormContent = (duration: string | undefined): boolean => {
  if (!duration) return false;
  
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return false;
  
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  
  // Only videos longer than 10 minutes are considered long form
  return hours > 0 || minutes >= 10;
};

export default function MoviesPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<MovieCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState<string | null>(null)

  // Initial load only once on component mount
  useEffect(() => {
    console.log("Initial load: Setting up movies page");
    setLoading(true);
    setApiError(null);
    
    // Load videos from YouTube API
    loadVideosFromAPI();
  }, []);

  // Function to check API status
  const checkApiStatus = async () => {
    try {
      const response = await fetch('/api/youtube/status')
      if (response.ok) {
        const data = await response.json()
        if (data && data.keyStatus) {
          // If no active keys, automatically use fallback
          if (data.keyStatus.activeKeys === 0) {
            useFallbackData('All YouTube API keys have reached their quota limits. Using cached movies instead.')
            return false
          }
        }
        return true
      }
    } catch (err) {
      console.error("Error checking API status:", err)
    }
    return true // Default to trying the API if status check fails
  }

  // Helper function to use fallback data
  const useFallbackData = (errorMessage = '') => {
    // Use local fallback data when API fails
    console.log('Using fallback movie data')
    
    // Filter videos that are likely movies from the fallback data
    const movieVideos = localVideos.filter(video => 
      video.category === 'movies' || 
      video.title.toLowerCase().includes('movie') ||
      video.title.toLowerCase().includes('trailer') ||
      video.title.toLowerCase().includes('film') ||
      video.description.toLowerCase().includes('movie') ||
      video.description.toLowerCase().includes('film')
    );
    
    // Create categories from fallback data
    const groupedCategories = createCategories(movieVideos);
    setCategories(groupedCategories);
    setLoading(false);
    
    if (errorMessage) {
      setApiError(errorMessage);
    }
  }

  const loadVideosFromAPI = async () => {
    try {
      // First check API status
      const shouldTryApi = await checkApiStatus();
      if (!shouldTryApi) {
        return; // checkApiStatus already called useFallbackData
      }

      // Check if we previously had a quota error to avoid unnecessary API calls
      let hasQuotaError = false;
      let quotaErrorTime = 0;
      
      try {
        hasQuotaError = localStorage.getItem('youtube_quota_exceeded') === 'true';
        quotaErrorTime = parseInt(localStorage.getItem('youtube_quota_error_time') || '0');
      } catch (e) {
        console.warn('Error accessing localStorage:', e);
      }
      
      const now = Date.now();
      const oneHourMs = 60 * 60 * 1000;
      
      // If we had a quota error in the last hour, use fallback data immediately
      if (hasQuotaError && now - quotaErrorTime < oneHourMs) {
        console.log('Recent quota error detected, using fallback data immediately');
        useFallbackData('YouTube API quota exceeded. Using cached movies.');
        return;
      }

      // Fetch movie videos from the YouTube API
      const result = await fetchWithCache('movies-page-videos', async () => {
        try {
          console.log("Fetching movie videos from YouTube API...");
          const response = await fetch('/api/youtube/movies?maxResults=50');
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('API Error:', response.status, errorData);
            
            // Handle specific error cases
            if (response.status === 429) {
              // Store quota error status and timestamp
              try {
                localStorage.setItem('youtube_quota_exceeded', 'true');
                localStorage.setItem('youtube_quota_error_time', Date.now().toString());
              } catch (e) {
                console.warn('Error setting localStorage:', e);
              }
              
              let quotaMessage = 'YouTube API quota exceeded. Using cached movies instead.';
              
              if (errorData.quotaExceeded) {
                // If all keys are exhausted, set a longer error message
                quotaMessage = 'All YouTube API quotas have been exhausted. This typically resets after 24 hours. Using cached movies instead.';
              }
              
              useFallbackData(quotaMessage);
              return { items: [] };
            } else if (response.status === 503) {
              throw new Error('YouTube API is not configured correctly. Please check with the administrator.');
            } else {
              throw new Error(`API error: ${response.status} ${errorData.error || ''}`);
            }
          }
          
          // Clear any previous quota error status
          try {
            localStorage.removeItem('youtube_quota_exceeded');
          } catch (e) {
            console.warn('Error removing localStorage item:', e);
          }
          
          return await response.json();
        } catch (error) {
          console.error("Error fetching movie videos:", error);
          throw error;
        }
      }, 30 * 60 * 1000); // Cache for 30 minutes

      if (result?.items && result.items.length > 0) {
        console.log(`Received ${result.items.length} movie videos from API`);
        
        // Convert YouTube API response to our Video type
        const videos: Video[] = result.items.map((item: any) => ({
          id: item.id,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.high?.url || 
                    item.snippet.thumbnails.medium?.url || 
                    item.snippet.thumbnails.default?.url,
          uploader: item.snippet.channelTitle,
          views: item.statistics?.viewCount || "0",
          uploadDate: item.snippet.publishedAt,
          description: item.snippet.description,
          platform: 'youtube',
          category: 'movies',
          likes: item.statistics?.likeCount || "0",
          comments: item.statistics?.commentCount || "0",
          url: `https://www.youtube.com/watch?v=${item.id}`,
          duration: item.contentDetails?.duration || "",
        }));
        
        // Filter for long-form content only
        const longFormVideos = videos.filter(video => isLongFormContent(video.duration));
        
        if (longFormVideos.length > 0) {
          // Create custom categories based on content
          const groupedCategories = createCategories(longFormVideos);
          setCategories(groupedCategories);
        } else {
          console.warn("No long-form movie videos found, using fallback data");
          useFallbackData('No long-form movie videos found');
        }
      } else {
        console.warn("No movie videos returned from API, using fallback data");
        useFallbackData('No movie videos returned from API');
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Error loading videos from API:", err);
      useFallbackData(err instanceof Error ? err.message : "Failed to load movie videos");
    }
  };

  // Create custom categories from fetched videos
  const createCategories = (videos: Video[]): MovieCategory[] => {
    // Sort videos by view count (most popular first)
    const sortedByViews = [...videos].sort((a, b) => {
      const aViews = typeof a.views === 'string' ? parseInt(a.views.replace(/[^0-9]/g, '')) : (a.views || 0);
      const bViews = typeof b.views === 'string' ? parseInt(b.views.replace(/[^0-9]/g, '')) : (b.views || 0);
      return bViews - aViews;
    });
    
    // Filter videos with "trailer" in title or description
    const trailers = videos.filter(v => 
      v.title.toLowerCase().includes('trailer') || 
      (v.description && v.description.toLowerCase().includes('trailer'))
    );
    
    // Filter videos with "review" in title or description
    const reviews = videos.filter(v => 
      v.title.toLowerCase().includes('review') || 
      (v.description && v.description.toLowerCase().includes('review'))
    );
    
    // Filter videos with "explained" or "explanation" in title or description
    const explanations = videos.filter(v => 
      v.title.toLowerCase().includes('explain') || 
      (v.description && v.description.toLowerCase().includes('explain'))
    );
    
    // Filter for Bollywood/Indian content
    const indianContent = videos.filter(v => 
      v.title.toLowerCase().includes('bollywood') || 
      v.title.toLowerCase().includes('hindi') ||
      v.title.toLowerCase().includes('indian') ||
      v.title.toLowerCase().includes('south') ||
      (v.description && (
        v.description.toLowerCase().includes('bollywood') ||
        v.description.toLowerCase().includes('hindi') ||
        v.description.toLowerCase().includes('indian') ||
        v.description.toLowerCase().includes('south')
      ))
    );

    // Create categories
    const categories: MovieCategory[] = [
      {
        title: "Featured Movies",
        videos: sortedByViews.slice(0, 5),
        type: 'featured',
        showMore: false
      },
      {
        title: "Top Movie Trailers",
        videos: trailers.length > 0 ? trailers.slice(0, 10) : sortedByViews.slice(0, 10),
        type: 'horizontal',
        showMore: true
      },
      {
        title: "Movie Reviews & Analysis",
        videos: reviews.length > 0 ? reviews.slice(0, 10) : sortedByViews.slice(5, 15),
        type: 'horizontal',
        showMore: true
      },
      {
        title: "Movies & Shows Explained",
        videos: explanations.length > 0 ? explanations.slice(0, 10) : sortedByViews.slice(10, 20),
        type: 'horizontal',
        showMore: true
      },
      {
        title: "Trending Indian Cinema",
        videos: indianContent.length > 0 ? indianContent.slice(0, 10) : sortedByViews.slice(15, 25),
        type: 'horizontal',
        showMore: true
      }
    ];
    
    return categories;
  };

  const handleVideoClick = (video: Video) => {
    sessionStorage.setItem('currentVideo', JSON.stringify({
      id: video.id,
      title: video.title,
      platform: 'youtube',
      thumbnailUrl: video.thumbnail,
      viewCount: typeof video.views === 'string' ? parseInt(video.views.replace(/[^0-9]/g, '')) : video.views,
      publishedAt: video.uploadDate
    }))
    router.push(`/player?v=${video.id}`)
  }

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (apiError || categories.length === 0) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center text-center px-4">
        <h2 className="text-xl font-semibold mb-2">Unable to load movies</h2>
        <p className="text-muted-foreground mb-4">{apiError || "No movie content available"}</p>
        <Button onClick={() => loadVideosFromAPI()}>
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero section with featured content */}
      <div className="mb-6">
        {categories.length > 0 && categories[0].type === 'featured' && (
          <MovieCarousel category={categories[0]} />
        )}
      </div>
      
      {/* Main content with category carousels */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        {categories.slice(1).map((category, index) => (
          <MovieCarousel key={index} category={category} />
        ))}
        
        {/* Video Grid Section for More Movies */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">More Movie Content</h2>
          {categories.length > 0 && categories[0].videos.length > 0 && (
            <VideoGrid 
              videos={[
                ...categories.flatMap(category => category.videos)
              ].filter((video, index, self) => 
                // Filter out duplicates by ID
                index === self.findIndex(v => v.id === video.id)
              ).slice(0, 20)}
              itemsPerPage={12}
            />
          )}
        </div>
      </div>
    </div>
  )
}