import type { Metadata } from "next"
import type { PropsWithChildren } from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import ClientLayout from "./client-layout"
import { Providers } from "./providers"
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration"
import { Fragment } from "react"
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
})

// Updated metadata configuration for Vercel deployment
export const metadata: Metadata = {
  title: 'Vidiony - Video Streaming Platform',
  description: 'Watch movies, TV shows, shorts, and music videos on Vidiony. Stream your favorite content anytime, anywhere.',
  keywords: 'video streaming, movies, TV shows, shorts, music videos, online streaming',
  authors: [{ name: 'Vidiony' }],
  creator: 'Vidiony',
  publisher: 'Vidiony',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://vidion.vercel.app'),
  alternates: {
    canonical: '/',
  },
  manifest: '/manifest.json',
  themeColor: '#000000',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Vidiony',
  },
  openGraph: {
    title: 'Vidiony - Video Streaming Platform',
    description: 'Watch movies, TV shows, shorts, and music videos on Vidiony. Stream your favorite content anytime, anywhere.',
    url: 'https://vidion.vercel.app',
    siteName: 'Vidiony',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vidiony - Video Streaming Platform',
    description: 'Watch movies, TV shows, shorts, and music videos on Vidiony. Stream your favorite content anytime, anywhere.',
  },
  verification: {
    google: 'ABCg9GS2lVnsrDFDj22yTT_Mc6ya9-fMXl09o3OIQ9I',
    other: {
      'msvalidate.01': '64FD345A7FD651E59AAAB61644D157FE'
    }
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    }
  },
  icons: {
    icon: [
      {
        url: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  },
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Fragment>
        <head>
          <link rel="dns-prefetch" href="https://image.tmdb.org" />
          <link rel="dns-prefetch" href="https://i.ytimg.com" />
          <link rel="preconnect" href="https://image.tmdb.org" crossOrigin="anonymous" />
          <link rel="preconnect" href="https://i.ytimg.com" crossOrigin="anonymous" />
          <meta name="application-name" content="Vidiony" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="apple-mobile-web-app-title" content="Vidiony" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-TileColor" content="#000000" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#000000" />
        </head>
        <body className={inter.className}>
          <Providers>
            <ServiceWorkerRegistration />
            <ClientLayout>{children}</ClientLayout>
            <Analytics />
          </Providers>
        </body>
      </Fragment>
    </html>
  )
}