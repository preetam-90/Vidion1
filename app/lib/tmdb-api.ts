// TMDB API utility functions
const TMDB_API_KEY = '4ae6258b13bf560a20e7f5923b43d80b';
const TMDB_API_READ_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0YWU2MjU4YjEzYmY1NjBhMjBlN2Y1OTIzYjQzZDgwYiIsIm5iZiI6MTc0NTU2NTI1OC40MzcsInN1YiI6IjY4MGIzNjRhNzc4YjQ2MjY3MzlkM2YxZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.VULVg647HVQBXa9gkk5Cmt6gglAYfLRxMUY8hBwiL9c';
const BASE_URL = 'https://api.themoviedb.org/3';

// Validate API credentials
if (!TMDB_API_KEY || !TMDB_API_READ_ACCESS_TOKEN) {
  console.error('TMDB API credentials are missing. Please check your .env.local file.');
  console.error('Current environment variables:', {
    NEXT_PUBLIC_TMDB_API_KEY: !!process.env.NEXT_PUBLIC_TMDB_API_KEY,
    NEXT_PUBLIC_TMDB_API_READ_ACCESS_TOKEN: !!process.env.NEXT_PUBLIC_TMDB_API_READ_ACCESS_TOKEN
  });
}

console.log('TMDB API Configuration:', {
  hasApiKey: !!TMDB_API_KEY,
  hasAccessToken: !!TMDB_API_READ_ACCESS_TOKEN,
  baseUrl: BASE_URL
});

// Types
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime?: number;
  genres?: { id: number; name: string }[];
  tagline?: string;
  status?: string;
  budget?: number;
  revenue?: number;
  production_companies?: { id: number; name: string; logo_path: string | null }[];
}

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface MovieCredits {
  id: number;
  cast: {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
    order: number;
  }[];
  crew: {
    id: number;
    name: string;
    job: string;
    department: string;
    profile_path: string | null;
  }[];
}

export interface MovieVideos {
  id: number;
  results: {
    id: string;
    key: string;
    name: string;
    site: string;
    type: string;
    official: boolean;
  }[];
}

// API functions
export async function fetchPopularMovies(page = 1): Promise<MoviesResponse> {
  console.log('Fetching popular movies...');
  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?page=${page}&region=IN`,
      {
        headers: {
          Authorization: `Bearer ${TMDB_API_READ_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('Popular movies response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Error fetching popular movies:', errorData);
      throw new Error(`Failed to fetch popular movies: ${errorData?.status_message || response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Popular movies data:', data);
    return data;
  } catch (error) {
    console.error('Error in fetchPopularMovies:', error);
    throw error;
  }
}

export async function fetchNowPlayingMovies(page = 1): Promise<MoviesResponse> {
  console.log('Fetching now playing movies...');
  try {
    const response = await fetch(
      `${BASE_URL}/movie/now_playing?page=${page}&region=IN`,
      {
        headers: {
          Authorization: `Bearer ${TMDB_API_READ_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('Now playing movies response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Error fetching now playing movies:', errorData);
      throw new Error(`Failed to fetch now playing movies: ${errorData?.status_message || response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Now playing movies data:', data);
    return data;
  } catch (error) {
    console.error('Error in fetchNowPlayingMovies:', error);
    throw error;
  }
}

export async function fetchTrendingMovies(timeWindow: 'day' | 'week' = 'week', page = 1): Promise<MoviesResponse> {
  const response = await fetch(
    `${BASE_URL}/trending/movie/${timeWindow}?api_key=${TMDB_API_KEY}&page=${page}&region=IN`,
    {
      headers: {
        Authorization: `Bearer ${TMDB_API_READ_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch trending movies');
  }
  
  return response.json();
}

export async function fetchMovieDetails(movieId: number): Promise<Movie> {
  const response = await fetch(
    `${BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`,
    {
      headers: {
        Authorization: `Bearer ${TMDB_API_READ_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch movie details');
  }
  
  return response.json();
}

export async function fetchMovieCredits(movieId: number): Promise<MovieCredits> {
  const response = await fetch(
    `${BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`,
    {
      headers: {
        Authorization: `Bearer ${TMDB_API_READ_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch movie credits');
  }
  
  return response.json();
}

export async function fetchMovieVideos(movieId: number): Promise<MovieVideos> {
  const response = await fetch(
    `${BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`,
    {
      headers: {
        Authorization: `Bearer ${TMDB_API_READ_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch movie videos');
  }
  
  return response.json();
}

export async function searchMovies(query: string, page = 1): Promise<MoviesResponse> {
  console.log('Searching movies...');
  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}&include_adult=false`,
      {
        headers: {
          Authorization: `Bearer ${TMDB_API_READ_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('Search movies response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Error searching movies:', errorData);
      throw new Error(`Failed to search movies: ${errorData?.status_message || response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Search movies data:', data);
    return data;
  } catch (error) {
    console.error('Error in searchMovies:', error);
    throw error;
  }
}

export function getImageUrl(path: string | null, size: 'original' | 'w500' | 'w780' | 'w185' = 'original'): string {
  if (!path) return '/images/placeholder-poster.jpg';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

// For genre-based fetches, add region=IN as well
async function fetchMoviesByGenre(genreId: number, page = 1) {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=4ae6258b13bf560a20e7f5923b43d80b&with_genres=${genreId}&sort_by=popularity.desc&page=${page}&region=IN`,
    {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0YWU2MjU4YjEzYmY1NjBhMjBlN2Y1OTIzYjQzZDgwYiIsIm5iZiI6MTc0NTU2NTI1OC40MzcsInN1YiI6IjY4MGIzNjRhNzc4YjQ2MjY3MzlkM2YxZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.VULVg647HVQBXa9gkk5Cmt6gglAYfLRxMUY8hBwiL9c`,
        'Content-Type': 'application/json',
      },
    }
  );
  // ... existing code ...
}

export async function fetchIndianMovies(page = 1): Promise<MoviesResponse> {
  console.log('Fetching Indian movies...');
  try {
    const response = await fetch(
      `${BASE_URL}/discover/movie?page=${page}&region=IN&with_original_language=hi&sort_by=popularity.desc`,
      {
        headers: {
          Authorization: `Bearer ${TMDB_API_READ_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('Indian movies response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Error fetching Indian movies:', errorData);
      throw new Error(`Failed to fetch Indian movies: ${errorData?.status_message || response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Indian movies data:', data);
    return data;
  } catch (error) {
    console.error('Error in fetchIndianMovies:', error);
    throw error;
  }
} 