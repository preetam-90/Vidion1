import { NextResponse } from 'next/server';
// Assume you have authentication middleware or helpers
// import { getCurrentUser } from '@/lib/auth'; 
// Assume you have database interaction functions
// import { addLike, removeLike, getLikedVideos } from '@/lib/db'; 

export const runtime = 'edge'

// Placeholder for user type - replace with your actual user type
interface User {
  id: string;
  // ... other user properties
}

// Placeholder function to get current user - replace with your actual implementation
async function getCurrentUser(): Promise<User | null> {
  // Simulate fetching a user
  console.log("Attempting to get current user (placeholder)");
  // In a real app, this would involve checking session, token, etc.
  // Return a dummy user for now, or null if not authenticated
  return { id: 'user-123-placeholder' }; 
  // return null; 
}

// Placeholder function - replace with actual DB call
async function addLike(userId: string, videoId: string): Promise<boolean> {
  console.log(`Placeholder: Adding like for user ${userId} on video ${videoId}`);
  // Simulate DB operation
  return true; 
}

// Placeholder function - replace with actual DB call
async function removeLike(userId: string, videoId: string): Promise<boolean> {
  console.log(`Placeholder: Removing like for user ${userId} on video ${videoId}`);
  // Simulate DB operation
  return true; 
}

// Use localStorage to store liked videos
const STORAGE_KEY = 'liked_videos';

// Helper function to get liked videos from localStorage
function getLikedVideosFromStorage(): string[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

// Helper function to save liked videos to localStorage
function saveLikedVideosToStorage(videoIds: string[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(videoIds));
}

// GET /api/likes - Fetches liked videos for the current user
export async function GET(request: Request) {
  try {
    const likedVideos = getLikedVideosFromStorage();
    return NextResponse.json(likedVideos);
  } catch (error) {
    console.error("Error fetching liked videos:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/likes - Adds a like for a video
export async function POST(request: Request) {
  try {
    const { videoId } = await request.json();
    if (!videoId || typeof videoId !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid videoId' }, { status: 400 });
    }

    const likedVideos = getLikedVideosFromStorage();
    if (!likedVideos.includes(videoId)) {
      likedVideos.push(videoId);
      saveLikedVideosToStorage(likedVideos);
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error adding like:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/likes - Removes a like for a video
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');

    if (!videoId || typeof videoId !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid videoId query parameter' }, { status: 400 });
    }

    const likedVideos = getLikedVideosFromStorage();
    const updatedLikedVideos = likedVideos.filter(id => id !== videoId);
    saveLikedVideosToStorage(updatedLikedVideos);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing like:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Optional: GET /api/likes/status?videoId=... - Check like status for a specific video
// You might not need this if the like status is included in the main video data fetch
// export async function GET_STATUS(request: Request) { ... } 
// Note: Next.js Route Handlers don't support multiple functions with the same HTTP method (like GET) 
// in the same file directly. You'd need separate files (e.g., app/api/likes/status/route.ts) 
// or handle it within the main GET using query parameters if feasible. 