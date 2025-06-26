'use client';

import { useEffect } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import Script from 'next/script';
import { videos } from '@/data';
import VideoCard from '@/components/video-card';

export default function VideosGalleryPage() {
  // Set page title
  usePageTitle('Video Gallery - Vidiony');
  
  // Get first 12 videos for display
  const displayVideos = videos.slice(0, 12);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Structured data for video gallery */}
      <Script id="video-gallery-schema" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": [
              ${displayVideos.map((video, index) => `
                {
                  "@type": "ListItem",
                  "position": ${index + 1},
                  "item": {
                    "@type": "VideoObject",
                    "name": "${video.title}",
                    "description": "${video.description || 'Watch this video on Vidiony'}",
                    "thumbnailUrl": "${video.thumbnail}",
                    "uploadDate": "${new Date(video.uploadDate || new Date()).toISOString()}",
                    "contentUrl": "https://vidion.vercel.app/video/${video.id}"
                  }
                }
              `).join(',')}
            ]
          }
        `}
      </Script>
      
      <h1 className="text-3xl font-bold mb-6">Vidiony Video Gallery</h1>
      <p className="text-lg mb-8">Browse videos from the Vidiony video streaming platform</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
} 