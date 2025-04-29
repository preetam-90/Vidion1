'use client'

import Link from 'next/link'
import { Fragment } from 'react'

export default function OfflinePage() {
  return (
    <Fragment>
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-4xl font-bold mb-4">You&apos;re Offline</h1>
        <p className="text-lg mb-8">Please check your internet connection and try again.</p>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Some features may be available offline if you&apos;ve visited them before.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Try Again
          </Link>
        </div>
      </div>
    </Fragment>
  )
} 