'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MoviesRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/tmdb-movies');
  }, [router]);
  
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
    </div>
  );
} 