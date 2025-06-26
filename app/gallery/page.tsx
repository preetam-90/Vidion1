'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { usePageTitle } from '@/hooks/usePageTitle';
import Script from 'next/script';

// Define the image gallery items
const galleryItems = [
  {
    src: '/logo.png',
    alt: 'Vidiony Logo',
    title: 'Vidiony Logo',
    description: 'The official logo of Vidiony video streaming platform'
  },
  {
    src: '/placeholder.jpg',
    alt: 'Vidiony Platform',
    title: 'Vidiony Platform',
    description: 'Watch videos on Vidiony streaming platform'
  },
  {
    src: '/previews/trending.png',
    alt: 'Trending Videos on Vidiony',
    title: 'Trending Videos',
    description: 'Discover popular trending videos on Vidiony'
  },
  {
    src: '/previews/movies.png',
    alt: 'Movies on Vidiony',
    title: 'Movies',
    description: 'Watch the latest movies on Vidiony'
  },
  {
    src: '/previews/music.png',
    alt: 'Music Videos on Vidiony',
    title: 'Music Videos',
    description: 'Watch music videos from your favorite artists on Vidiony'
  },
  {
    src: '/youtube-music-icon.png',
    alt: 'Vidiony Music',
    title: 'Vidiony Music',
    description: 'Stream music videos on Vidiony'
  },
  {
    src: '/previews/gaming.png',
    alt: 'Gaming Videos on Vidiony',
    title: 'Gaming Videos',
    description: 'Watch gaming videos and gameplay on Vidiony'
  },
  {
    src: '/previews/tmdb movies.png',
    alt: 'TMDB Movies on Vidiony',
    title: 'TMDB Movies',
    description: 'Browse and watch TMDB movies on Vidiony'
  },
  {
    src: '/previews/explore.png',
    alt: 'Explore Videos on Vidiony',
    title: 'Explore Videos',
    description: 'Discover and explore videos on Vidiony'
  },
  {
    src: '/previews/history.png',
    alt: 'Watch History on Vidiony',
    title: 'Watch History',
    description: 'View your watch history on Vidiony'
  },
  {
    src: '/placeholder-thumbnail.jpg',
    alt: 'Video Thumbnail',
    title: 'Video Thumbnail',
    description: 'Example video thumbnail on Vidiony'
  },
  {
    src: '/images/placeholder-poster.jpg',
    alt: 'Movie Poster',
    title: 'Movie Poster',
    description: 'Example movie poster on Vidiony'
  }
];

export default function GalleryPage() {
  // Set page title
  usePageTitle('Image Gallery - Vidiony');
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Structured data for image gallery */}
      <Script id="gallery-schema" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            "name": "Vidiony Image Gallery",
            "description": "A collection of images from the Vidiony video streaming platform",
            "image": ${JSON.stringify(galleryItems.map(item => `https://vidion.vercel.app${item.src}`))}
          }
        `}
      </Script>
      
      <h1 className="text-3xl font-bold mb-6">Vidiony Image Gallery</h1>
      <p className="text-lg mb-8">Browse images from the Vidiony video streaming platform</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {galleryItems.map((item, index) => (
          <div key={index} className="bg-card rounded-lg overflow-hidden shadow-lg">
            <div className="relative h-48">
              <Image 
                src={item.src} 
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover"
                priority={index < 4}
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 