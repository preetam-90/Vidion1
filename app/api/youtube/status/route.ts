import { NextResponse } from 'next/server';
import { getYouTubeAPIStatus, validateYouTubeAPIKeys } from '@/lib/youtube-api';

export const runtime = 'edge'

// Endpoint to check YouTube API key status
export async function GET() {
  try {
    // Get current status without validation
    const currentStatus = getYouTubeAPIStatus();
    
    // If requested with validation=true, run a validation check
    const validationStatus = await validateYouTubeAPIKeys();
    
    return NextResponse.json({
      status: 'success',
      message: 'YouTube API key status',
      keyStatus: validationStatus,
      timestamp: new Date().toISOString(),
      quotaResetInfo: 'YouTube API quotas typically reset at midnight Pacific Time (PT)'
    });
  } catch (error) {
    console.error('Error checking YouTube API key status:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to check YouTube API key status',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 