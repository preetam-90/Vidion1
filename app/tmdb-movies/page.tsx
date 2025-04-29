'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl, Movie, fetchIndianMovies } from '../../lib/tmdb-api';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import LatestMoviesCarousel from './components/LatestMoviesCarousel';
import LatestMoviesRow from './components/LatestMoviesRow';

const TMDB_GENRES = [
  { id: 18, name: 'Drama' },
  { id: 28, name: 'Action & Adventure' },
  { id: 10749, name: 'Romance' },
  { id: 27, name: 'Horror' },
  { id: 35, name: 'Comedy' },
  { id: 16, name: 'Animation' },
  { id: 99, name: 'Documentary' },
  { id: 10751, name: 'Family' },
  { id: 878, name: 'Sci-Fi & Fantasy' },
  { id: 80, name: 'Crime' },
  { id: 9648, name: 'Mystery' },
  { id: 12, name: 'Adventure' },
  { id: 36, name: 'History' },
  { id: 10402, name: 'Music' },
  { id: 14, name: 'Fantasy' },
  { id: 53, name: 'Thriller' },
  { id: 37, name: 'Western' },
  { id: 10770, name: 'TV Movie' },
];

async function fetchMoviesByGenre(genreId: number, page = 1) {
  const apiUrl = 'https://api.themoviedb.org/3/discover/movie';
  const params = new URLSearchParams({
    with_genres: genreId.toString(),
    sort_by: 'popularity.desc',
    page: page.toString(),
    region: 'IN'
  });
  
  const res = await fetch(
    `${apiUrl}?${params.toString()}`,
    {
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0YWU2MjU4YjEzYmY1NjBhMjBlN2Y1OTIzYjQzZDgwYiIsIm5iZiI6MTc0NTU2NTI1OC40MzcsInN1YiI6IjY4MGIzNjRhNzc4YjQ2MjY3MzlkM2YxZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.VULVg647HVQBXa9gkk5Cmt6gglAYfLRxMUY8hBwiL9c`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  console.log('API Response Status:', res.status);
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    console.error('API Error:', errorData);
    return { results: [], total_pages: 1 };
  }
  
  const data = await res.json();
  return { results: data.results || [], total_pages: data.total_pages };
}

const MoviePoster = ({ movie, genreId, setHovered, setHoverPos }: { 
  movie: Movie; 
  genreId: number;
  setHovered: (value: { genreId: number; movieId: number } | null) => void;
  setHoverPos: (value: { left: number; top: number } | null) => void;
}) => {
  const posterRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  
  // Handle click to navigate to movie detail page
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/tmdb-movies/${movie.id}`);
  };
  
  const handleMouseEnter = () => {
    setIsHovering(true);
    
    // Clear any existing timeout to prevent multiple triggers
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Set a delay before showing the popup
    hoverTimeoutRef.current = setTimeout(() => {
      if (posterRef.current) {
        const rect = posterRef.current.getBoundingClientRect();
        setHovered({ genreId, movieId: movie.id });
        setHoverPos({
          left: rect.left + rect.width / 2,
          top: rect.top,
        });
      }
    }, 400); // 400ms delay before showing the popup
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
    
    // Clear the timeout if mouse leaves before it triggers
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
    // Use a very short delay before hiding to prevent flickering
    setTimeout(() => {
      if (!isHovering) {
        setHovered(null);
        setHoverPos(null);
      }
    }, 50);
  };
  
  // Clean up timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);
  
  return (
    <div 
      ref={posterRef}
      className="flex-shrink-0 relative movie-poster"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        onClick={handleClick}
        className="cursor-pointer"
      >
        <motion.div 
          className="w-[180px] h-[270px] rounded-lg overflow-hidden bg-gray-800 transition-shadow duration-300"
          initial={{ scale: 1, zIndex: 10 }}
          animate={{ 
            scale: isHovering ? 1.1 : 1,
            zIndex: isHovering ? 20 : 10,
            boxShadow: isHovering ? '0 10px 25px rgba(0, 0, 0, 0.5)' : '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 25,
            duration: 0.3
          }}
        >
          <Image
            src={getImageUrl(movie.poster_path, 'w500')}
            alt={movie.title}
            width={180}
            height={270}
            className="object-cover object-center w-full h-full"
          />
        </motion.div>
      </div>
    </div>
  );
};

const GenreRow = ({ 
  genre, 
  movies, 
  isLoading, 
  setHovered, 
  setHoverPos, 
  loadMore 
}: { 
  genre: { id: number; name: string }; 
  movies: Movie[]; 
  isLoading: boolean;
  setHovered: (value: { genreId: number; movieId: number } | null) => void;
  setHoverPos: (value: { left: number; top: number } | null) => void;
  loadMore: () => void;
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isHoveringRow, setIsHoveringRow] = useState(false);
  
  // Filter out duplicate movies by id
  const uniqueMovies = [];
  const seenIds = new Set();
  for (const movie of movies) {
    if (!seenIds.has(movie.id)) {
      uniqueMovies.push(movie);
      seenIds.add(movie.id);
    }
  }
  
  // Function to scroll left
  const scrollLeft = () => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: -800, behavior: 'smooth' });
    }
  };
  
  // Function to scroll right
  const scrollRight = () => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: 800, behavior: 'smooth' });
      // Load more if we're scrolling right and near the end
      const row = rowRef.current;
      if (row.scrollLeft + row.clientWidth >= row.scrollWidth - 800) {
        loadMore();
      }
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
  
  return (
    <div 
      className="mb-10 relative"
      onMouseEnter={() => setIsHoveringRow(true)}
      onMouseLeave={() => setIsHoveringRow(false)}
    >
      <h2 className="text-xl font-bold text-white mb-4">{genre.name}</h2>
      
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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
      
      <div
        className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide"
        ref={rowRef}
        style={{ scrollBehavior: 'smooth' }}
        onScroll={handleScroll}
        onMouseEnter={handleScroll}
      >
        {uniqueMovies.map((movie) => (
          <MoviePoster 
            key={movie.id} 
            movie={movie} 
            genreId={genre.id}
            setHovered={setHovered}
            setHoverPos={setHoverPos}
          />
        ))}
        {isLoading && (
          <div className="flex items-center justify-center w-[180px] h-[270px]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
      </div>
    </div>
  );
};

const MoviesPage = () => {
  const router = useRouter();
  const [genreMovies, setGenreMovies] = useState<{ [key: number]: Movie[] }>({});
  const [hoveredMovie, setHoveredMovie] = useState<{ genreId: number; movieId: number } | null>(null);
  const [hoveredDetails, setHoveredDetails] = useState<Movie | null>(null);
  const [hoverPos, setHoverPos] = useState<{ left: number; top: number } | null>(null);
  const [genrePages, setGenrePages] = useState<{ [key: number]: number }>({});
  const [genreTotalPages, setGenreTotalPages] = useState<{ [key: number]: number }>({});
  const [loadingMore, setLoadingMore] = useState<{ [key: number]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Handle global mouse movement for popup management
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      // If we have a popup visible but mouse is far from poster areas, hide it
      if (hoveredMovie) {
        // Check if the mouse is on the popup
        const popup = document.querySelector('.movie-popup');
        if (popup) {
          const rect = popup.getBoundingClientRect();
          const isOnPopup = 
            e.clientX >= rect.left && 
            e.clientX <= rect.right && 
            e.clientY >= rect.top && 
            e.clientY <= rect.bottom;
          
          if (isOnPopup) {
            return; // Keep popup visible if mouse is on it
          }
        }
        
        // Check if mouse is on any poster
        const posters = document.querySelectorAll('.movie-poster');
        let isOnPoster = false;
        
        posters.forEach(poster => {
          const rect = poster.getBoundingClientRect();
          if (
            e.clientX >= rect.left && 
            e.clientX <= rect.right && 
            e.clientY >= rect.top && 
            e.clientY <= rect.bottom
          ) {
            isOnPoster = true;
          }
        });
        
        if (!isOnPoster) {
          setHoveredMovie(null);
          setHoverPos(null);
        }
      }
    };
    
    document.addEventListener('mousemove', handleGlobalMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [hoveredMovie]);
  
  // Load movie details when hovering
  useEffect(() => {
    if (hoveredMovie) {
      const movie = getHoveredMovie();
      if (movie) {
        setHoveredDetails(movie);
      }
    } else {
      setHoveredDetails(null);
    }
  }, [hoveredMovie, genreMovies]);

  useEffect(() => {
    async function fetchAllGenres() {
      setLoading(true);
      setError(null);
      try {
        const results: { [genreId: number]: Movie[] } = {};
        const pages: { [genreId: number]: number } = {};
        const totalPages: { [genreId: number]: number } = {};
        await Promise.all(
          TMDB_GENRES.map(async (genre) => {
            try {
              // Fetch regular movies for the genre
              const { results: movies, total_pages } = await fetchMoviesByGenre(genre.id, 1);
              
              // Fetch Indian movies for the genre
              const res = await fetch(
                `https://api.themoviedb.org/3/discover/movie?with_genres=${genre.id}&with_original_language=hi&sort_by=popularity.desc&page=1&region=IN`,
                {
                  headers: {
                    'Authorization': `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0YWU2MjU4YjEzYmY1NjBhMjBlN2Y1OTIzYjQzZDgwYiIsIm5iZiI6MTc0NTU2NTI1OC40MzcsInN1YiI6IjY4MGIzNjRhNzc4YjQ2MjY3MzlkM2YxZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.VULVg647HVQBXa9gkk5Cmt6gglAYfLRxMUY8hBwiL9c`,
                    'Content-Type': 'application/json'
                  }
                }
              );
              
              if (!res.ok) {
                const errorData = await res.json().catch(() => null);
                console.error(`Error fetching Indian movies for genre ${genre.id}:`, errorData);
                return;
              }
              
              const indianData = await res.json();
              const indianMovies = indianData.results || [];
              
              // Merge and deduplicate (interleave)
              const maxLen = Math.max(movies.length, indianMovies.length);
              const mixedMovies: Movie[] = [];
              for (let i = 0; i < maxLen; i++) {
                if (i < movies.length) mixedMovies.push(movies[i]);
                if (i < indianMovies.length) mixedMovies.push(indianMovies[i]);
              }
              
              const uniqueMovies = mixedMovies.filter((movie, index, self) =>
                index === self.findIndex((m) => m.id === movie.id)
              );
              
              results[genre.id] = uniqueMovies;
              pages[genre.id] = 1;
              totalPages[genre.id] = total_pages;
            } catch (err) {
              console.error(`Error processing genre ${genre.id}:`, err);
            }
          })
        );
        
        setGenreMovies(results);
        setGenrePages(pages);
        setGenreTotalPages(totalPages);
      } catch (err) {
        console.error('Error in fetchAllGenres:', err);
        setError(err instanceof Error ? err.message : 'Failed to load movies');
      } finally {
        setLoading(false);
      }
    }
    fetchAllGenres();
    document.title = 'TMDB Movies | Vidiony';
  }, []);

  const getHoveredMovie = () => {
    if (!hoveredMovie) return null;
    const movies = genreMovies[hoveredMovie.genreId];
    if (!movies) return null;
    return movies.find(m => m.id === hoveredMovie.movieId) || null;
  };

  const loadMoreMovies = async (genreId: number) => {
    const currentPage = genrePages[genreId] || 1;
    const totalPages = genreTotalPages[genreId] || 1;
    
    if (currentPage < totalPages && !loadingMore[genreId]) {
      setLoadingMore(prev => ({ ...prev, [genreId]: true }));
      
      try {
        const nextPage = currentPage + 1;
        const { results: newMovies } = await fetchMoviesByGenre(genreId, nextPage);
        
        setGenreMovies(prev => ({
          ...prev,
          [genreId]: [...(prev[genreId] || []), ...newMovies]
        }));
        
        setGenrePages(prev => ({ ...prev, [genreId]: nextPage }));
      } catch (err) {
        console.error('Error loading more movies:', err);
      } finally {
        setLoadingMore(prev => ({ ...prev, [genreId]: false }));
      }
    }
  };

  const navigateToMovie = (movieId: number) => {
    router.push(`/tmdb-movies/${movieId}`);
  };

  return (
    <div className="w-full min-h-screen bg-black text-white pb-10">
      <div className="w-full px-2 pt-6">
        {/* Latest Released Movies Carousel */}
        <LatestMoviesCarousel />
        {/* Latest Movies Row */}
        <LatestMoviesRow />
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-xl text-red-500">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {TMDB_GENRES.map(genre => {
              const movies = genreMovies[genre.id] || [];
              if (movies.length === 0) return null;
              return (
                <GenreRow 
                  key={genre.id} 
                  genre={genre} 
                  movies={movies} 
                  isLoading={loadingMore[genre.id] || false}
                  setHovered={setHoveredMovie}
                  setHoverPos={setHoverPos}
                  loadMore={() => loadMoreMovies(genre.id)}
                />
              );
            })}
          </>
        )}
      </div>
      {/* Movie detail hover card */}
      <AnimatePresence>
        {hoveredMovie && hoverPos && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ 
              duration: 0.4,
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
            className="fixed z-50 bg-gray-900 rounded-lg shadow-xl w-96 overflow-hidden movie-popup"
            style={{
              left: `${Math.min(hoverPos.left, window.innerWidth - 400)}px`,
              top: `${hoverPos.top + 30}px`,
            }}
          >
            {hoveredDetails ? (
              <>
                <div className="relative h-48 w-full">
                  <Image 
                    src={getImageUrl(hoveredDetails.backdrop_path, 'w780')} 
                    alt={hoveredDetails.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{hoveredDetails.title}</h3>
                  <div className="flex items-center mt-2 text-sm text-gray-400">
                    <span>{new Date(hoveredDetails.release_date).getFullYear()}</span>
                    <span className="mx-2">•</span>
                    <span>{hoveredDetails.vote_average.toFixed(1)} ⭐</span>
                  </div>
                  <p className="mt-3 text-sm line-clamp-3 text-gray-300">{hoveredDetails.overview}</p>
                  <button 
                    onClick={() => navigateToMovie(hoveredDetails.id)}
                    className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md w-full transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </>
            ) : (
              <div className="h-80 w-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MoviesPage; 