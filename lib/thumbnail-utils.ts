// Utility functions for YouTube thumbnail handling

/**
 * Extract YouTube video ID from various YouTube URL formats
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
    /youtube\.com\/.*[?&]v=([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

/**
 * Generate YouTube thumbnail URL from video ID
 */
export function getYouTubeThumbnailUrl(videoId: string, quality: 'default' | 'hqdefault' | 'mqdefault' | 'sddefault' | 'maxresdefault' = 'hqdefault'): string {
  if (!videoId) return '/placeholder-thumbnail.jpg';
  return `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`;
}

/**
 * Get the best available thumbnail URL for a video
 */
export function getBestThumbnailUrl(video: { thumbnail?: string; url?: string; id?: string | number }): string {
  // If we have a thumbnail, use it
  if (video.thumbnail && video.thumbnail.trim() !== '') {
    return video.thumbnail;
  }
  
  // Try to extract YouTube video ID from URL
  if (video.url) {
    const videoId = extractYouTubeVideoId(video.url);
    if (videoId) {
      return getYouTubeThumbnailUrl(videoId, 'hqdefault');
    }
  }
  
  // If we have a video ID that looks like a YouTube ID, use it directly
  if (video.id && typeof video.id === 'string' && video.id.length === 11) {
    return getYouTubeThumbnailUrl(video.id, 'hqdefault');
  }
  
  // Fallback to placeholder
  return '/placeholder-thumbnail.jpg';
}

/**
 * Handle thumbnail error and try fallback URLs
 */
export function handleThumbnailError(
  event: React.SyntheticEvent<HTMLImageElement>,
  video: { thumbnail?: string; url?: string; id?: string | number }
): void {
  const target = event.target as HTMLImageElement;
  const currentSrc = target.src;
  
  // If it's already a YouTube thumbnail and failed, try different quality
  if (currentSrc.includes('ytimg.com')) {
    if (currentSrc.includes('hqdefault')) {
      // Try to extract video ID from URL or use the video ID directly
      let videoId = extractYouTubeVideoId(video.url || '');
      
      // If we couldn't extract from URL, try to use the video ID directly if it looks like a YouTube ID
      if (!videoId && video.id && typeof video.id === 'string' && video.id.length === 11) {
        videoId = video.id;
      }
      
      if (videoId) {
        target.src = getYouTubeThumbnailUrl(videoId, 'mqdefault');
        return;
      }
    } else if (currentSrc.includes('mqdefault')) {
      let videoId = extractYouTubeVideoId(video.url || '');
      
      if (!videoId && video.id && typeof video.id === 'string' && video.id.length === 11) {
        videoId = video.id;
      }
      
      if (videoId) {
        target.src = getYouTubeThumbnailUrl(videoId, 'default');
        return;
      }
    }
  }
  
  // If the original thumbnail failed, try YouTube thumbnail
  if (video.url && !currentSrc.includes('ytimg.com')) {
    const videoId = extractYouTubeVideoId(video.url);
    if (videoId) {
      target.src = getYouTubeThumbnailUrl(videoId, 'hqdefault');
      return;
    }
  }
  
  // Try to use the video ID directly if it looks like a YouTube ID
  if (video.id && typeof video.id === 'string' && video.id.length === 11 && !currentSrc.includes('ytimg.com')) {
    target.src = getYouTubeThumbnailUrl(video.id, 'hqdefault');
    return;
  }
  
  // Final fallback
  target.src = '/placeholder-thumbnail.jpg';
}
