"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useMobile } from "@/hooks/use-mobile"
import { useWatchLater } from "@/contexts/watch-later-context"
import SearchBar from "@/components/search-bar"

// Define props interface
interface NavbarProps {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

// Use props in component signature
export default function Navbar({ isMobileMenuOpen, toggleMobileMenu }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const isMobile = useMobile()
  const { watchLaterVideos } = useWatchLater()
  const [tmdbSearchQuery, setTmdbSearchQuery] = useState("")
  
  // Check if current page is a TMDB page
  const isTMDBPage = pathname === "/tmdb-movies" || pathname.startsWith("/tmdb-movies/")
  
  // Don't show the TMDB search bar on search pages or movie detail pages
  const isSearchPage = pathname === '/tmdb-movies/search' || pathname.startsWith('/tmdb-movies/search/');
  const isDetailPage = /^\/tmdb-movies\/\d+/.test(pathname);
  const shouldShowTMDBSearchBar = isTMDBPage && !isSearchPage;

  // Handle TMDB search
  const handleTMDBSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (tmdbSearchQuery.trim()) {
      router.push(`/tmdb-movies/search?q=${encodeURIComponent(tmdbSearchQuery.trim())}`)
    }
  }

  // Add console log to check mobile detection
  useEffect(() => {
    console.log('Is Mobile:', isMobile)
  }, [isMobile])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-6 flex-1 justify-between">
          <Link href="/" className="flex items-center group relative">
            <div className="relative overflow-hidden">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
                Vidiony
              </span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 group-hover:w-full transition-all duration-300 ease-in-out" />
            </div>
          </Link>

          <div className="flex items-center gap-4 w-full justify-center">
            {!isTMDBPage && (
              <div className="w-full">
                <SearchBar />
              </div>
            )}
            
            {shouldShowTMDBSearchBar && (
              <div className="w-full">
                <form onSubmit={handleTMDBSearch} className="flex w-full max-w-lg mx-auto">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      placeholder="Search movies..."
                      value={tmdbSearchQuery}
                      onChange={(e) => setTmdbSearchQuery(e.target.value)}
                      className="w-full py-2 px-4 pr-10 rounded-l-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-r-lg focus:outline-none"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                </form>
              </div>
            )}
          </div>
          
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  )
}

const categories = [
  'All', 'Music', 'Mixes', 'Podcasts', 'Ghost stories', 'Film criticisms', 'Live', 'History', 'Dramedy', 'Photography', 'Culinary arts', 'Gadgets', 'Presentations', 'Asian music'
];

const CategoryNavbar = () => {
  return (
    <div className="navbar">
      {categories.map((category, index) => (
        <button key={index} className="category-button">
          {category}
        </button>
      ))}
    </div>
  );
};
