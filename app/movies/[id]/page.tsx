'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export const runtime = 'edge'

export default function MovieDetailsRedirect() {
  const params = useParams();
  const router = useRouter();
  const movieId = params.id;
  
  useEffect(() => {
    if (movieId) {
      router.replace(`/tmdb-movies/${movieId}`);
    } else {
      router.replace('/tmdb-movies');
    }
  }, [router, movieId]);
  
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
    </div>
  );
} 