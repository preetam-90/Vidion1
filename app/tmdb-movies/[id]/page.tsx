'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  fetchMovieDetails,
  fetchMovieCredits,
  fetchMovieVideos,
  getImageUrl,
  Movie,
  MovieCredits,
  MovieVideos
} from '@/lib/tmdb-api';

const MovieDetails = () => {
  const params = useParams();
  const router = useRouter();
  const movieId = params.id;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [credits, setCredits] = useState<MovieCredits | null>(null);
  const [videos, setVideos] = useState<MovieVideos | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'cast' | 'videos'>('overview');

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!movieId || typeof movieId !== 'string') {
        router.push('/tmdb-movies');
        return;
      }

      try {
        setLoading(true);
        const id = parseInt(movieId);
        
        const [movieData, creditsData, videosData] = await Promise.all([
          fetchMovieDetails(id),
          fetchMovieCredits(id),
          fetchMovieVideos(id)
        ]);
        
        setMovie(movieData);
        setCredits(creditsData);
        setVideos(videosData);
        setError(null);

        // Update the document title directly
        if (movieData) {
          document.title = `${movieData.title} (${new Date(movieData.release_date).getFullYear()}) | TMDB Movies`;
        }
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Failed to load movie details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [movieId, router]);

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-500 text-white p-4 rounded-lg">
          <p>{error || 'Movie not found'}</p>
        </div>
      </div>
    );
  }

  const directors = credits?.crew.filter(person => person.job === 'Director') || [];
  const topCast = credits?.cast.slice(0, 10) || [];
  const trailer = videos?.results.find(video => 
    video.site === 'YouTube' && 
    (video.type === 'Trailer' || video.type === 'Teaser')
  );

  return (
    <div className="min-h-screen">
      {/* Hero section with backdrop */}
      <div className="relative h-[50vh] md:h-[70vh]">
        <div className="absolute inset-0">
          <Image
            src={getImageUrl(movie.backdrop_path, 'original')}
            alt={movie.title}
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 h-full flex items-end pb-8 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 w-full">
            <div className="hidden md:block w-64 shrink-0">
              <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-xl">
                <Image
                  src={getImageUrl(movie.poster_path, 'w500')}
                  alt={movie.title}
                  width={500}
                  height={750}
                  className="object-cover object-center w-full h-full"
                />
              </div>
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                {movie.title} <span className="text-gray-300 font-normal">({new Date(movie.release_date).getFullYear()})</span>
              </h1>
              
              {movie.tagline && (
                <p className="text-xl text-gray-300 italic mb-4">{movie.tagline}</p>
              )}
              
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres?.map(genre => (
                  <span key={genre.id} className="bg-gray-700 px-3 py-1 rounded-full text-sm text-white">
                    {genre.name}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center gap-4 text-gray-300 mb-6">
                <div className="flex items-center">
                  <div className="flex items-center bg-yellow-500 px-2 py-1 rounded text-sm font-medium text-gray-900 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {movie.vote_average.toFixed(1)}
                  </div>
                  <span className="text-sm">{movie.vote_count.toLocaleString()} votes</span>
                </div>
                
                {movie.runtime && (
                  <span>• {formatRuntime(movie.runtime)}</span>
                )}
                
                <span>• {new Date(movie.release_date).toLocaleDateString()}</span>
              </div>
              
              {directors.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-gray-400 text-sm mb-1">Director{directors.length > 1 ? 's' : ''}</h3>
                  <p className="text-white">
                    {directors.map(director => director.name).join(', ')}
                  </p>
                </div>
              )}
              
              {trailer && (
                <a
                  href={`/video/${trailer.key}`}
                  className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  onClick={(e) => {
                    e.preventDefault();
                    // Store trailer info in sessionStorage
                    sessionStorage.setItem('currentVideo', JSON.stringify({
                      id: trailer.key,
                      title: trailer.name || movie.title + ' - Trailer',
                      platform: 'youtube',
                      url: `https://www.youtube.com/watch?v=${trailer.key}`,
                      thumbnail: movie.backdrop_path ? getImageUrl(movie.backdrop_path, 'w780') : null
                    }));
                    // Navigate to the video page
                    router.push(`/video/${trailer.key}`);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Watch Trailer
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs and Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 border-b border-gray-700">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'overview'
                  ? 'border-white text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('cast')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'cast'
                  ? 'border-white text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Cast
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'videos'
                  ? 'border-white text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Videos
            </button>
          </nav>
        </div>
        
        {/* Tab content */}
        <div>
          {activeTab === 'overview' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
                  <p className="text-gray-300 mb-8 text-lg leading-relaxed">{movie.overview}</p>
                  
                  {movie.status && (
                    <div className="mb-4">
                      <h3 className="text-white font-medium mb-1">Status</h3>
                      <p className="text-gray-300">{movie.status}</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Information</h2>
                  
                  {movie.budget !== undefined && movie.budget > 0 && (
                    <div className="mb-4">
                      <h3 className="text-white font-medium mb-1">Budget</h3>
                      <p className="text-gray-300">{formatMoney(movie.budget)}</p>
                    </div>
                  )}
                  
                  {movie.revenue !== undefined && movie.revenue > 0 && (
                    <div className="mb-4">
                      <h3 className="text-white font-medium mb-1">Revenue</h3>
                      <p className="text-gray-300">{formatMoney(movie.revenue)}</p>
                    </div>
                  )}
                  
                  {movie.production_companies && movie.production_companies.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-white font-medium mb-1">Production</h3>
                      <p className="text-gray-300">
                        {movie.production_companies.map(company => company.name).join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'cast' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Top Cast</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {topCast.map(person => (
                  <div key={person.id} className="bg-gray-800 rounded-lg overflow-hidden">
                    <div className="aspect-[2/3] w-full overflow-hidden bg-gray-700">
                      <Image
                        src={getImageUrl(person.profile_path, 'w185')}
                        alt={person.name}
                        width={185}
                        height={278}
                        className="object-cover object-center w-full h-full"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-white">{person.name}</h3>
                      <p className="text-sm text-gray-400">{person.character}</p>
                    </div>
                  </div>
                ))}
                
                {topCast.length === 0 && (
                  <p className="text-gray-400 col-span-full">No cast information available.</p>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'videos' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Videos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {videos?.results
                  .filter(video => video.site === 'YouTube')
                  .map(video => (
                    <div key={video.id} className="bg-gray-800 rounded-lg overflow-hidden">
                      <div className="aspect-video w-full">
                        <iframe
                          src={`https://www.youtube.com/embed/${video.key}`}
                          title={video.name}
                          className="w-full h-full"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  ))}
                
                {(!videos?.results || videos.results.length === 0) && (
                  <p className="text-gray-400 col-span-full">No videos available.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails; 