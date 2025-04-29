import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://vidion.vercel.app'
  
  // Define your main routes
  const routes = [
    '',
    '/home',
    '/movies',
    '/trending',
    '/explore',
    '/shorts',
    '/immersive-shorts',
    '/music',
    '/favorites',
    '/watch-later',
    '/history',
    '/search',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return routes
} 