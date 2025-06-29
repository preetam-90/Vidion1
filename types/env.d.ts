declare namespace NodeJS {
  interface ProcessEnv {
    // TMDB API
    NEXT_PUBLIC_TMDB_API_KEY: string;
    NEXT_PUBLIC_TMDB_API_READ_ACCESS_TOKEN: string;
    
    // Clerk Authentication
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
    CLERK_SECRET_KEY: string;
    NEXT_PUBLIC_CLERK_FRONTEND_API: string;
    CLERK_API_URL: string;
    CLERK_JWKS_URL: string;
    CLERK_JWKS_PUBLIC_KEY: string;
    
    // YouTube API (optional)
    NEXT_PUBLIC_YOUTUBE_API_KEYS?: string;
  }
} 