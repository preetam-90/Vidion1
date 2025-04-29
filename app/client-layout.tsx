"use client"

import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { WatchLaterProvider } from "@/contexts/watch-later-context"
import { LikedVideosProvider } from "@/contexts/liked-videos-context"
import { useState, Suspense, useEffect } from "react"
import { Toaster } from "@/components/ui/sonner"
import { usePathname } from "next/navigation"
import dynamic from "next/dynamic"

// Dynamically import Navbar and Sidebar for better code splitting
const Navbar = dynamic(() => import("@/components/navbar"), {
  ssr: true,
  loading: () => <div className="h-16 w-full bg-background border-b"></div>
})

const CategoryBar = dynamic(() => import("./components/CategoryBar"), {
  ssr: true,
  loading: () => <div className="h-8 w-full bg-background border-b"></div>
})

const Sidebar = dynamic(() => import("@/components/sidebar"), {
  ssr: false,
  loading: () => (
    <div className="hidden md:block w-64 h-full bg-background border-r animate-pulse"></div>
  )
})

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  
  // Check if current page is the movies page where we use a custom sidebar
  const isMoviesPage = pathname === "/category/movies" || pathname.startsWith("/category/movies/")
  
  // Check if current page is the watch page
  const isWatchPage = pathname === "/watch" || pathname.startsWith("/watch/")

  // Add watch-page-active class to body when on watch page
  useEffect(() => {
    if (isWatchPage) {
      document.body.classList.add('watch-page-active')
      document.documentElement.classList.add('watch-page-active')
    } else {
      document.body.classList.remove('watch-page-active')
      document.documentElement.classList.remove('watch-page-active')
    }
    
    return () => {
      document.body.classList.remove('watch-page-active')
      document.documentElement.classList.remove('watch-page-active')
    }
  }, [isWatchPage])

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <div className="flex flex-col min-h-screen">
      {!isMoviesPage && (
        <div className="fixed top-0 left-0 right-0 z-50 flex flex-col">
          <Navbar isMobileMenuOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />
          {!isWatchPage && <CategoryBar />}
        </div>
      )}
      <div className={`flex flex-1 ${!isMoviesPage ? 'pt-16' : ''} ${isWatchPage ? 'pt-16 md:pt-16' : ''}`}>
        {!isMoviesPage && !isWatchPage && (
          <Suspense fallback={<div className="w-64 h-full bg-background border-r"></div>}>
            <Sidebar 
              isMobileMenuOpen={isMobileMenuOpen} 
              closeMobileMenu={closeMobileMenu}
              toggleMobileMenu={toggleMobileMenu}
            />
          </Suspense>
        )}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      themes={["light", "dark", "system"]}
    >
      <LikedVideosProvider>
        <WatchLaterProvider>
          <LayoutContent>{children}</LayoutContent>
          <Toaster />
        </WatchLaterProvider>
      </LikedVideosProvider>
    </ThemeProvider>
  )
} 