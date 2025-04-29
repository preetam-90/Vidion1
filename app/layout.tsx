import type { Metadata } from "next"
import "./globals.css"
import { Inter } from "next/font/google"
import ClientLayout from "./client-layout"
import { Providers } from "./providers"
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration"
import { ReactNode } from "react"

const inter = Inter({ subsets: ["latin"] })

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
    bing: '64FD345A7FD651E59AAAB61644D157FE',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
    bingbot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <ServiceWorkerRegistration />
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  )
}