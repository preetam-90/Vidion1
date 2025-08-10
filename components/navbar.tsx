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
import UserAvatar from "@/components/user-avatar";

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
        <Button size="sm" variant="outline">Login</Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 p-0 rounded-full" aria-label="User menu">
          <UserAvatar size="sm" />
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
          <Link href="/handler/account-settings">Account Settings</Link>
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

  const isMoviesPage = pathname === "/category/movies"
  const isCollapsedPage = isMoviesPage

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 md:hidden"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Logo */}
        <Link href="/home" className="flex items-center space-x-2">
          <Image 
            src="/image-removebg-preview.png" 
            alt="Vidion Logo" 
            width={32} 
            height={32} 
            className="rounded"
          />
          <span className="hidden font-bold sm:inline-block">
            Vidion
          </span>
        </Link>

        {/* Central search - expanded on desktop, collapsible on mobile */}
        <div className="flex-1 mx-4">
          <div className="flex items-center justify-center">
            <AnimatePresence mode="wait">
              {(searchExpanded || !isMobile) && (
                <motion.div
                  key="search-expanded"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "100%", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="max-w-2xl w-full"
                >
                  <SearchBar />
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Mobile search toggle */}
            {isMobile && !searchExpanded && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchExpanded(true)}
                aria-label="Open search"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
            
            {/* Mobile search close */}
            {isMobile && searchExpanded && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchExpanded(false)}
                className="ml-2"
                aria-label="Close search"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <UserProfile />
        </div>
      </div>
    </nav>
  )
}
