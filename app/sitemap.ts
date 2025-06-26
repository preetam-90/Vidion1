import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://vidion.vercel.app/main-sitemap.xml',
      lastModified: new Date(),
    },
    {
      url: 'https://vidion.vercel.app/video-sitemap.xml',
      lastModified: new Date(),
    },
    {
      url: 'https://vidion.vercel.app/image-sitemap.xml',
      lastModified: new Date(),
    },
  ]
} 