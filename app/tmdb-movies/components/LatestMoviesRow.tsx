'use client';

import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchNowPlayingMovies, fetchIndianMovies, getImageUrl, Movie } from '../../../lib/tmdb-api';

export default function LatestMoviesRow(): React.ReactElement {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isHoveringRow, setIsHoveringRow] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [autoScrollPaused, setAutoScrollPaused] = useState(false);
  
  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true);
        const [latestData, indianData] = await Promise.all([
          fetchNowPlayingMovies(),
          fetchIndianMovies()
        ]);
        // Combine and shuffle the movies
        const combinedMovies = [...latestData.results, ...indianData.results];
        // Remove duplicates based on movie ID
        const uniqueMovies = combinedMovies.filter((movie, index, self) =>
          index === self.findIndex((m) => m.id === movie.id)
        );
        // Sort by release date in descending order (newest first)
        uniqueMovies.sort((a, b) => {
          const dateA = new Date(a.release_date).getTime();
          const dateB = new Date(b.release_date).getTime();
          return dateB - dateA;
        });
        setMovies(uniqueMovies.slice(0, 12)); // Only latest 12
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to load movies');
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, []);

  // Auto-scroll logic with pause/resume
  useEffect(() => {
    let direction = 1; // 1 for right, -1 for left
    const scrollAmount = 1; // px per tick
    const interval = setInterval(() => {
      if (!autoScrollPaused && rowRef.current) {
        const row = rowRef.current;
        if (direction === 1 && row.scrollLeft + row.clientWidth >= row.scrollWidth - 2) {
          direction = -1;
        } else if (direction === -1 && row.scrollLeft <= 2) {
          direction = 1;
        }
        row.scrollLeft += scrollAmount * direction;
      }
    }, 20);
    return () => clearInterval(interval);
  }, [movies, autoScrollPaused]);

  // Helper to pause and resume auto-scroll
  const pauseAutoScroll = () => {
    setAutoScrollPaused(true);
    if ((window as any)._resumeTimeout) clearTimeout((window as any)._resumeTimeout);
    (window as any)._resumeTimeout = setTimeout(() => {
      setAutoScrollPaused(false);
    }, 3000); // Resume after 3 seconds
  };

  // Function to scroll left
  const scrollLeft = () => {
    pauseAutoScroll();
    if (rowRef.current) {
      // Calculate scroll amount based on screen size
      const scrollAmount = window.innerWidth < 640 ? 220 : 320;
      rowRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };
  
  // Function to scroll right
  const scrollRight = () => {
    pauseAutoScroll();
    if (rowRef.current) {
      // Calculate scroll amount based on screen size
      const scrollAmount = window.innerWidth < 640 ? 220 : 320;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  
  // Check scroll position to determine if arrows should be shown
  const handleScroll = () => {
    if (!rowRef.current || !isHoveringRow) return;
    
    const row = rowRef.current;
    const isAtStart = row.scrollLeft < 20;
    const isNearEnd = row.scrollLeft + row.clientWidth >= row.scrollWidth - 300;
    
    setShowLeftArrow(isHoveringRow && !isAtStart);
    setShowRightArrow(isHoveringRow && !isNearEnd);
  };
  
  // Set up scroll listener
  useEffect(() => {
    const row = rowRef.current;
    if (row) {
      row.addEventListener('scroll', handleScroll);
      return () => row.removeEventListener('scroll', handleScroll);
    }
  }, [isHoveringRow]);
  
  // Update arrows on hover state change
  useEffect(() => {
    handleScroll();
  }, [isHoveringRow]);

  const handleMovieClick = (movieId: number) => {
    router.push(`/tmdb-movies/${movieId}`);
  };

  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8 md:space-y-10">
        <div className="mb-6 sm:mb-8 md:mb-10">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Latest Releases</h2>
          <div className="flex gap-2 sm:gap-3 md:gap-4 overflow-hidden">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="flex-shrink-0 w-[160px] sm:w-[180px] md:w-[320px] h-[90px] sm:h-[120px] md:h-[180px] bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || (movies.length === 0)) {
    return (
      <div className="space-y-6 sm:space-y-8 md:space-y-10">
        <div className="mb-6 sm:mb-8 md:mb-10">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Latest Releases</h2>
          <div className="w-full h-[120px] sm:h-[180px] md:h-[240px] bg-gray-900 rounded-lg flex items-center justify-center">
            <p className="text-white text-sm sm:text-base md:text-lg">{error || 'No movies available'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative mb-6 sm:mb-8 md:mb-10"
      onMouseEnter={() => setIsHoveringRow(true)}
      onMouseLeave={() => setIsHoveringRow(false)}
    >
      <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Latest Releases</h2>
      
      <div
        className="flex overflow-x-auto gap-2 sm:gap-3 md:gap-4 scrollbar-hide"
        ref={rowRef}
        style={{ scrollBehavior: 'smooth' }}
        onScroll={handleScroll}
        onMouseEnter={handleScroll}
      >
        {movies.map((movie) => (
          <div 
            key={movie.id}
            className="flex-shrink-0 relative movie-poster cursor-pointer focus:outline-none"
            onClick={() => handleMovieClick(movie.id)}
          >
            <motion.div 
              className="w-[160px] sm:w-[220px] md:w-[320px] h-[90px] sm:h-[120px] md:h-[180px] rounded-lg overflow-hidden bg-gray-800 transition-shadow duration-300"
              whileHover={{ 
                scale: 1.05,
                zIndex: 20,
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)'
              }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 25
              }}
            >
              <Image
                src={getImageUrl(movie.backdrop_path || movie.poster_path, 'w780')}
                alt={movie.title}
                width={320}
                height={180}
                className="object-cover object-center w-full h-full"
              />
              <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-xs sm:text-sm font-medium text-white line-clamp-1 sm:line-clamp-2">{movie.title}</h3>
                <p className="text-[10px] sm:text-xs text-gray-300 mt-0.5 sm:mt-1">
                  {new Date(movie.release_date).getFullYear()}
                </p>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
      
      {/* Left scroll arrow */}
      <AnimatePresence>
        {showLeftArrow && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            tabIndex={-1}
            onFocus={(e) => e.target.blur()}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-black/70 hover:bg-black/90 rounded-full p-1.5 text-white focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:border-0"
            onClick={scrollLeft}
          >
            <ChevronLeft className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* Right scroll arrow */}
      <AnimatePresence>
        {showRightArrow && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            tabIndex={-1}
            onFocus={(e) => e.target.blur()}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-black/70 hover:bg-black/90 rounded-full p-1.5 text-white focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:border-0"
            onClick={scrollRight}
          >
            <ChevronRight className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
} 