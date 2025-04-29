'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchNowPlayingMovies, fetchIndianMovies, getImageUrl, Movie } from '@/lib/tmdb-api';

export default function LatestMoviesRow() {
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
      rowRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };
  
  // Function to scroll right
  const scrollRight = () => {
    pauseAutoScroll();
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: 320, behavior: 'smooth' });
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
      <div className="space-y-10">
        <div className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Latest Releases</h2>
          <div className="flex gap-4 overflow-hidden">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="flex-shrink-0 w-[180px] h-[270px] bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || (movies.length === 0)) {
    return (
      <div className="space-y-10">
        <div className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Latest Releases</h2>
          <div className="w-full h-[270px] bg-gray-900 rounded-lg flex items-center justify-center">
            <p className="text-white text-lg">{error || 'No movies available'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHoveringRow(true)}
      onMouseLeave={() => setIsHoveringRow(false)}
    >
      <div
        className="flex overflow-x-auto gap-4 scrollbar-hide"
        ref={rowRef}
        style={{ scrollBehavior: 'smooth' }}
        onScroll={handleScroll}
        onMouseEnter={handleScroll}
      >
        {movies.map((movie) => (
          <div 
            key={movie.id}
            className="flex-shrink-0 relative movie-poster cursor-pointer"
            onClick={() => handleMovieClick(movie.id)}
          >
            <motion.div 
              className="w-[320px] h-[180px] overflow-hidden bg-gray-800 transition-shadow duration-300"
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
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-sm font-medium text-white line-clamp-2">{movie.title}</h3>
                <p className="text-xs text-gray-300 mt-1">
                  {new Date(movie.release_date).getFullYear()}
                </p>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
      
      {/* Left arrow */}
      <AnimatePresence>
        {showLeftArrow && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute left-0 top-1/2 transform -translate-y-8 z-30 bg-black/70 hover:bg-black/90 rounded-full p-2 text-white"
            onClick={scrollLeft}
          >
            <ChevronLeft className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* Right arrow */}
      <AnimatePresence>
        {showRightArrow && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute right-0 top-1/2 transform -translate-y-8 z-30 bg-black/70 hover:bg-black/90 rounded-full p-2 text-white"
            onClick={scrollRight}
          >
            <ChevronRight className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
} 