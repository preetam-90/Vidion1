/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static page generation for faster loading
  output: 'export',

  // Enable image optimization
  images: {
    domains: ['image.tmdb.org', 'i.ytimg.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Enable experimental features for better performance
  experimental: {
    // Enable server components
    serverComponents: true,
    // Enable concurrent features
    concurrentFeatures: true,
    // Enable React server components
    serverActions: true,
    // Enable optimizing CSS
    optimizeCss: true,
    // Enable modern JavaScript features
    esmExternals: true,
    // Enable HTTP/2 Push
    http2Push: true,
    // Enable granular chunks
    granularChunks: true,
    // Enable optimizing fonts
    optimizeFonts: true,
    // Enable modern build output
    modern: true,
    // Enable scroll restoration
    scrollRestoration: true,
  },

  // Enable compression
  compress: true,

  // Enable React strict mode
  reactStrictMode: true,

  // Configure headers for caching and security
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Configure webpack for better performance
  webpack: (config, { dev, isServer }) => {
    // Enable tree shaking
    config.optimization = {
      ...config.optimization,
      usedExports: true,
    }

    // Enable module concatenation
    config.optimization.concatenateModules = true

    // Enable production mode optimizations
    if (!dev) {
      config.optimization.minimize = true
    }

    return config
  },
}

export default nextConfig
