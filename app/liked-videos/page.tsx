"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useLikedVideos } from '@/contexts/liked-videos-context';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Skeleton } from '@/components/ui/skeleton';
import { PremiumVideoCard } from '@/components/PremiumVideoCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ThumbsUp, Search, SlidersHorizontal, X, 
  ArrowUpDown, Clock, Calendar, 
  Sparkles, Bookmark, Grid, List
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Video } from '@/types/data';

export default function LikedVideosPage() {
  const { likedVideos } = useLikedVideos();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'popular' | 'alphabetical'>('recent');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // Set page title
  usePageTitle("Liked Videos");

  // Initialize and filter videos
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Extract unique categories
  useEffect(() => {
    if (likedVideos.length > 0) {
      const uniqueCategories = Array.from(new Set(likedVideos.map(video => video.category)));
      setCategories(uniqueCategories);
    }
  }, [likedVideos]);

  // Filter and sort videos
  useEffect(() => {
    let result = [...likedVideos];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(video => 
        video.title.toLowerCase().includes(query) || 
        video.uploader.toLowerCase().includes(query)
      );
    }
    
    if (filterCategory) {
      result = result.filter(video => video.category === filterCategory);
    }
    
    switch (sortBy) {
      case 'recent': break;
      case 'oldest': result = [...result].reverse(); break;
      case 'popular': 
        result = [...result].sort((a, b) => {
          const likesA = typeof a.likes === 'string' ? parseInt(a.likes.replace(/[^0-9]/g, '')) : a.likes || 0;
          const likesB = typeof b.likes === 'string' ? parseInt(b.likes.replace(/[^0-9]/g, '')) : b.likes || 0;
          return likesB - likesA;
        });
        break;
      case 'alphabetical': 
        result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    
    setFilteredVideos(result);
  }, [likedVideos, searchQuery, filterCategory, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setFilterCategory(null);
    setSortBy('recent');
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col space-y-8">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-48 rounded-xl" />
            <Skeleton className="h-10 w-32 rounded-xl" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <Skeleton className="aspect-video rounded-2xl" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (likedVideos.length === 0) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center min-h-[70vh] text-center bg-background/50 backdrop-blur-lg p-8 rounded-3xl border border-border/30"
        >
          <div className="relative w-72 h-72 mb-8">
            <div className="flex items-center justify-center h-full">
              <ThumbsUp className="h-32 w-32 text-muted-foreground/30" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            No Liked Videos Yet
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mb-8">
            Start liking videos to build your personal collection of favorite content
          </p>
          <Link href="/trending">
            <Button size="lg" className="rounded-full px-8 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 shadow-lg">
              Explore Trending Videos
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3 bg-background/80 backdrop-blur-lg p-4 rounded-2xl border border-border/30">
            <div className="p-2 bg-primary/10 rounded-full">
              <ThumbsUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Liked Videos
              </h1>
              <p className="text-sm text-muted-foreground">Your liked video collection</p>
            </div>
            <Badge variant="outline" className="ml-2 text-xs">
              {likedVideos.length} {likedVideos.length === 1 ? 'video' : 'videos'}
            </Badge>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your liked videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-border/50 focus-visible:ring-primary"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Sort & Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setSortBy('recent')}>
                <Clock className="mr-2 h-4 w-4" />
                Recently Liked
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('oldest')}>
                <Calendar className="mr-2 h-4 w-4" />
                Oldest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('popular')}>
                <ThumbsUp className="mr-2 h-4 w-4" />
                Most Popular
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('alphabetical')}>
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Alphabetical
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              
              {categories.map(category => (
                <DropdownMenuItem 
                  key={category}
                  onClick={() => setFilterCategory(prev => prev === category ? null : category)}
                >
                  <span>{category}</span>
                  {filterCategory === category && (
                    <span className="ml-auto">✓</span>
                  )}
                </DropdownMenuItem>
              ))}
              
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={clearFilters}>
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Active Filters */}
        {(searchQuery || filterCategory || sortBy !== 'recent') && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {searchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: {searchQuery}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 ml-1 p-0" 
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {filterCategory && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Category: {filterCategory}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 ml-1 p-0" 
                  onClick={() => setFilterCategory(null)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {sortBy !== 'recent' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Sort: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 ml-1 p-0" 
                  onClick={() => setSortBy('recent')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7" 
              onClick={clearFilters}
            >
              Clear All
            </Button>
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">
                {filteredVideos.length === likedVideos.length ? 'All Liked Videos' : 'Filtered Results'}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {filteredVideos.length} {filteredVideos.length === 1 ? 'video' : 'videos'}
            </p>
          </div>

          {filteredVideos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-muted/30 p-4 rounded-full mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">No matching videos found</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                Try adjusting your search or filters to find what you're looking for
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredVideos.map((video) => (
                  <motion.div
                    key={video.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PremiumVideoCard
                      video={video}
                      context="liked-videos"
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}