import { NextResponse } from 'next/server';

export const runtime = 'edge'

// Use localStorage to store liked videos
const STORAGE_KEY = 'liked_videos';

// Helper function to get liked videos from localStorage
function getLikedVideosFromStorage(): string[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

// GET /api/likes/status?videoId=...
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');

    if (!videoId || typeof videoId !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid videoId query parameter' }, { status: 400 });
    }

    const likedVideos = getLikedVideosFromStorage();
    const isLiked = likedVideos.includes(videoId);

    return NextResponse.json({ isLiked });
  } catch (error) {
    console.error("Error checking like status:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 