"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle"
import { useMobile } from "@/hooks/use-mobile"
import { useWatchLater } from "@/contexts/watch-later-context"
import SearchBar from "@/components/search-bar"
import { AnimatePresence, motion } from "framer-motion"
import { useUser } from "@stackframe/stack";

// Define props interface
interface NavbarProps {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

function UserProfile() {
  const user = useUser();

  if (!user) {
    return (
      <Link href="/sign-in">
        <Button>Login</Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <img
            key={user.profileImageUrl} // Add key to force re-render on image URL change
            src={`/api/proxy/image?url=${encodeURIComponent(user.profileImageUrl || "/placeholder-user.jpg")}`}
            alt={user.displayName || "User Avatar"}
            width={32}
            height={32}
            className="rounded-full"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName || user.primaryEmail}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.primaryEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account">Account Setting</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => user.signOut()}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Use props in component signature
export default function Navbar({ isMobileMenuOpen, toggleMobileMenu }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const isMobile = useMobile()
  const [isPortrait, setIsPortrait] = useState<boolean>(false)
  const [isTablet, setIsTablet] = useState<boolean>(false)
  const { watchLaterVideos } = useWatchLater()
  const [tmdbSearchQuery, setTmdbSearchQuery] = useState("")
  const [searchExpanded, setSearchExpanded] = useState(false)
  
  // Detect orientation (portrait vs landscape)
  useEffect(() => {
    const mql = window.matchMedia('(orientation: portrait)')
    const onChange = (e: MediaQueryListEvent) => setIsPortrait(e.matches)
    mql.addEventListener('change', onChange)
    setIsPortrait(mql.matches)
    return () => mql.removeEventListener('change', onChange)
  }, [])
  
  // Detect tablet size - between 768px and 1024px
  useEffect(() => {
    const tabletMql = window.matchMedia('(min-width: 768px) and (max-width: 1024px)')
    const onChange = (e: MediaQueryListEvent) => setIsTablet(e.matches)
    tabletMql.addEventListener('change', onChange)
    setIsTablet(tabletMql.matches)
    return () => tabletMql.removeEventListener('change', onChange)
  }, [])
  
  // Portrait mobile when both mobile width and portrait orientation
  const isSmallPhone = isMobile && !isTablet 
  const isPortraitMobile = isSmallPhone && isPortrait
  
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
      if (isMobile && searchExpanded) {
        setSearchExpanded(false)
      }
    }
  }

  // Toggle search bar on mobile
  const toggleSearchBar = () => {
    setSearchExpanded(!searchExpanded)
  }

  // Close search bar when clicking outside
  const searchBarRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setSearchExpanded(false)
      }
    }
    
    if (searchExpanded) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [searchExpanded])

  // Reset search expanded state when screen size or orientation changes
  useEffect(() => {
    setSearchExpanded(false)
  }, [isMobile, isPortrait])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-6 flex-1 justify-between">
          {/* Logo - hidden when search is expanded on mobile */}
          <AnimatePresence>
            {(!isMobile || !searchExpanded) && (
              <motion.div
                initial={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Link href="/" className="flex items-center group relative">
                  <div className="relative overflow-hidden">
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
                      Vidiony
                    </span>
                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 group-hover:w-full transition-all duration-300 ease-in-out" />
                  </div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search Area */}
          <div className="flex items-center gap-4 w-full justify-center" ref={searchBarRef}>
            {/* Mobile Portrait Icon (only for non-TMDB pages) */}
            {isPortraitMobile && !searchExpanded && !isTMDBPage && (
              <button 
                onClick={toggleSearchBar} 
                className="p-2 text-foreground hover:bg-accent rounded-full"
                aria-label="Open search"
              >
                <Search className="h-5 w-5" />
              </button>
            )}
            
            {/* Regular Search (YouTube) */}
            {!isTMDBPage && (
              <>
                {(!isPortraitMobile || searchExpanded) && (
                  <motion.div 
                    className="w-full"
                    initial={isPortraitMobile ? { opacity: 0, width: 0 } : { opacity: 1, width: "100%" }}
                    animate={{ opacity: 1, width: "100%" }}
                    exit={isPortraitMobile ? { opacity: 0, width: 0 } : { opacity: 1, width: "100%" }}
                    transition={{ duration: 0.3 }}
                  >
                    <SearchBar closeSearchBar={() => setSearchExpanded(false)} />
                  </motion.div>
                )}
              </>
            )}
            
            {/* TMDB Search */}
            {shouldShowTMDBSearchBar && (
              <>
                {isPortraitMobile && !searchExpanded ? (
                  <button 
                    onClick={toggleSearchBar} 
                    className="p-2 text-foreground hover:bg-accent rounded-full"
                    aria-label="Open search"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                ) : (
                  <motion.div 
                    className="w-full"
                    initial={isPortraitMobile ? { opacity: 0, width: 0 } : { opacity: 1, width: "100%" }}
                    animate={{ opacity: 1, width: "100%" }}
                    exit={isPortraitMobile ? { opacity: 0, width: 0 } : { opacity: 1, width: "100%" }}
                    transition={{ duration: 0.3 }}
                  >
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
                      {isPortraitMobile && (
                        <button 
                          type="button"
                          onClick={() => setSearchExpanded(false)} 
                          className="ml-2 p-2 text-foreground hover:bg-gray-700 rounded-full"
                          aria-label="Close search"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </form>
                  </motion.div>
                )}
              </>
            )}
          </div>
          
          {/* Theme Toggle - hidden when search is expanded on mobile */}
          <AnimatePresence>
            {(!isMobile || !searchExpanded) && (
              <motion.div 
                className="flex items-center"
                initial={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ThemeToggle />
                <UserProfile />
              </motion.div>
            )}
          </AnimatePresence>
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
