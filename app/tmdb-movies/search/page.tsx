'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { searchMovies, getImageUrl, Movie } from '@/lib/tmdb-api';
import { Search, ArrowLeft } from 'lucide-react';

export default function TMDBSearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Search for movies when the page loads with a query parameter
  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
    
    // Set document title
    document.title = query ? `Search: ${query} | TMDB Movies` : 'Search | TMDB Movies';
  }, [query]);

  const performSearch = async (searchTerm: string, pageNum = 1) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await searchMovies(searchTerm, pageNum);
      setResults(response.results);
      setTotalPages(response.total_pages);
      setPage(pageNum);
    } catch (err) {
      console.error('Error searching movies:', err);
      setError('Failed to search movies. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const MovieCard = ({ movie }: { movie: Movie }) => (
    <Link href={`/tmdb-movies/${movie.id}`} className="group relative flex flex-col overflow-hidden rounded-lg bg-gray-800 hover:bg-gray-700 transition-all duration-200">
      <div className="aspect-[2/3] w-full overflow-hidden">
        <Image
          src={getImageUrl(movie.poster_path, 'w500')}
          alt={movie.title}
          width={500}
          height={750}
          className="object-cover object-center transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-medium text-white mb-1 line-clamp-1">{movie.title}</h3>
        <p className="text-sm text-gray-300 mb-2">{movie.release_date && new Date(movie.release_date).getFullYear()}</p>
        <div className="flex items-center mt-auto">
          <div className="flex items-center bg-yellow-500 px-1.5 py-0.5 rounded text-xs font-medium text-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {movie.vote_average.toFixed(1)}
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link href="/tmdb-movies" className="mr-4">
          <ArrowLeft className="h-6 w-6 text-white" />
        </Link>
        <h1 className="text-3xl font-bold text-white">TMDB Movie Search</h1>
      </div>
      
      {/* Search Bar */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex w-full max-w-lg mx-auto">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-4 pr-10 rounded-l-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Search className="h-5 w-5" />
          </button>
        </form>
      </div>
      
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="bg-red-500 text-white p-4 rounded-lg mb-8">
          <p>{error}</p>
        </div>
      )}
      
      {/* No Results */}
      {!loading && results.length === 0 && searchQuery && (
        <div className="text-center py-12 bg-gray-800 rounded-lg mb-8">
          <p className="text-xl text-white mb-2">No results found for "{searchQuery}"</p>
          <p className="text-gray-400">Try different keywords or check spelling</p>
        </div>
      )}
      
      {/* Search Results */}
      {results.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Search Results for "{query}"</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {results.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      )}
      
      {/* Pagination */}
      {results.length > 0 && totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            <button
              onClick={() => performSearch(searchQuery, Math.max(1, page - 1))}
              disabled={page === 1}
              className={`px-4 py-2 rounded ${
                page === 1 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              Previous
            </button>
            
            <span className="px-4 py-2 bg-blue-600 text-white rounded">
              Page {page} of {totalPages}
            </span>
            
            <button
              onClick={() => performSearch(searchQuery, Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded ${
                page === totalPages 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 