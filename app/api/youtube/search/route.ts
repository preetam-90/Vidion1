import { NextResponse } from 'next/server'
import { videos as localVideos } from '@/data'
import type { Video } from '@/data'

// Remove edge runtime to allow access to server-side environment variables
// export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const maxResults = parseInt(searchParams.get('maxResults') || '5')

    // Use local videos as fallback if no API keys available
    const filteredVideos = localVideos
      .filter(video => 
        video.title.toLowerCase().includes(query.toLowerCase()) ||
        video.description.toLowerCase().includes(query.toLowerCase()) ||
        video.category.toLowerCase() === query.toLowerCase()
      )
      .slice(0, maxResults)

    return NextResponse.json({ videos: filteredVideos })
  } catch (error) {
    console.error('YouTube search API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    )
  }
}