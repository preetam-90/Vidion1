'use client';

import React, { useState, useCallback } from 'react';
import { YouTubeVideo } from '@/lib/youtube-api';
import NewsVideoGrid from '@/components/news/news-video-grid';
import { Newspaper, Search, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useInfiniteAPIScroll } from '@/hooks/useInfiniteScroll';

const popularChannels = [
  'NDTV India',
  'Aaj Tak',
  'India Today',
  'Republic TV',
  'ABP News',
  'Times Now',
  'India TV',
  'News18 India',
  'DD News'
];

// Fallback data in case the API fails completely
const fallbackVideos = [
  {
    id: "fallback-1",
    snippet: {
      title: "Latest News Update",
      description: "Breaking news coverage",
      channelTitle: "News Channel",
      publishedAt: new Date().toISOString(),
      thumbnails: {
        high: { url: '/images/placeholder-poster.jpg', width: 480, height: 360 },
        medium: { url: '/images/placeholder-poster.jpg', width: 320, height: 180 },
        default: { url: '/images/placeholder-poster.jpg', width: 120, height: 90 }
      }
    },
    statistics: { viewCount: "1000", likeCount: "100", commentCount: "10" },
    contentDetails: { duration: "PT10M" }
  }
];

const NewsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentChannel, setCurrentChannel] = useState('');

  // Function to fetch news videos with pagination
  const fetchNewsVideos = useCallback(async (pageToken?: string, queryIndex?: number) => {
    try {
      let url = '/api/youtube/news';
      const params = new URLSearchParams();
      
      if (pageToken) {
        params.append('pageToken', pageToken);
      }
      
      if (queryIndex !== undefined) {
        params.append('queryIndex', queryIndex.toString());
      }
      
      // Add the search query if we're searching for a specific channel
      if (currentChannel) {
        url = `/api/youtube/search`;
        params.append('q', currentChannel);
      }
      
      // Append params to the URL
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      console.log(`Fetching: ${url}`);
      const response = await fetch(url, {
        // Add cache control headers to prevent stale responses
        cache: 'no-store',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API response error:', response.status, errorText);
        throw new Error(`Failed to fetch news videos: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Received ${data?.items?.length || 0} videos, nextPageToken: ${data?.nextPageToken || 'none'}`);
      
      if (!data.items || data.items.length === 0) {
        // If no items but we have a next page token, return that to keep pagination working
        if (data.nextPageToken || data.nextQueryIndex !== undefined) {
          return {
            items: [],
            nextPageToken: data.nextPageToken || null,
            nextQueryIndex: data.nextQueryIndex
          };
        }
        
        console.warn('No videos returned, using fallback data');
        // Return fallback data if API returns empty
        return {
          items: fallbackVideos,
          nextPageToken: null,
          nextQueryIndex: 0
        };
      }
      
      return {
        items: data.items || [],
        nextPageToken: data.nextPageToken || null,
        nextQueryIndex: data.nextQueryIndex
      };
    } catch (err) {
      console.error('Error fetching news videos:', err);
      // Return fallback data on error to prevent breaking the UI
      return {
        items: fallbackVideos,
        nextPageToken: null,
        nextQueryIndex: 0
      };
    }
  }, [currentChannel]);
  
  // Use the infinite scroll hook with error handling
  const { 
    items: videos, 
    loading, 
    error, 
    loaderRef, 
    hasMore,
    refresh
  } = useInfiniteAPIScroll<YouTubeVideo>({
    fetchFunction: fetchNewsVideos,
    batchSize: 24,
    key: currentChannel, // This will trigger a refresh when the channel changes
    initialItems: [] // Start with empty array
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentChannel(searchQuery.trim());
    }
  };

  const handleChannelClick = (channel: string) => {
    setSearchQuery(channel);
    setCurrentChannel(channel);
  };

  const handleReset = () => {
    setSearchQuery('');
    setCurrentChannel('');
  };

  const handleRetry = () => {
    refresh();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6 border-b pb-4">
        <Newspaper className="w-8 h-8 mr-3 text-red-500" />
        <div>
          <h1 className="text-3xl font-bold">Indian News</h1>
          <p className="text-gray-500 mt-1">
            {currentChannel ? 
              `Showing news from ${currentChannel}` : 
              'Latest news updates from India\'s top news channels'}
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <Input
          type="text"
          placeholder="Search for news channel..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
        <Button type="submit">
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
        <Button 
          variant="outline" 
          type="button"
          onClick={handleReset}
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </form>
      
      <div className="mb-6 flex flex-wrap gap-2">
        <p className="text-sm font-medium mr-2 flex items-center">Popular channels:</p>
        {popularChannels.map(channel => (
          <Button 
            key={channel}
            variant="outline" 
            size="sm"
            className={currentChannel === channel ? "bg-red-100 hover:bg-red-200" : ""}
            onClick={() => handleChannelClick(channel)}
          >
            {channel}
          </Button>
        ))}
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          <p className="font-medium">Error loading news videos</p>
          <p className="text-sm">{error}</p>
          <Button onClick={handleRetry} className="mt-3" variant="destructive" size="sm">
            <RefreshCcw className="w-3 h-3 mr-2" /> Retry
          </Button>
        </div>
      )}
      
      <NewsVideoGrid videos={videos} isLoading={loading && videos.length === 0} />
      
      {/* Loader element that will trigger loading more videos when it comes into view */}
      {hasMore && (
        <div 
          ref={loaderRef} 
          className="w-full py-8 flex justify-center"
        >
          {loading && videos.length > 0 && (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-t-red-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <p className="mt-2 text-sm text-gray-500">Loading more videos...</p>
            </div>
          )}
        </div>
      )}
      
      {!hasMore && videos.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>You've reached the end of the list</p>
        </div>
      )}
    </div>
  );
};

export default NewsPage;