"use client"

import type React from "react"
import { useEffect } from "react" // Removed useState
import Link from "next/link"
import Image from "next/image" // Added import for Image
import { usePathname } from "next/navigation"
import { Menu, X, Home, TrendingUp, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useMobile } from "@/hooks/use-mobile"
import { useWatchLater } from "@/contexts/watch-later-context"
import SearchBar from "@/components/search-bar"
import React from 'react';

// Define props interface
interface NavbarProps {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

// Use props in component signature
export default function Navbar({ isMobileMenuOpen, toggleMobileMenu }: NavbarProps) {
  const pathname = usePathname()
  const isMobile = useMobile()
  // Removed local state: const [showMobileMenu, setShowMobileMenu] = useState(false)
  const { watchLaterVideos } = useWatchLater()

  // Add console log to check mobile detection
  useEffect(() => {
    console.log('Is Mobile:', isMobile)
  }, [isMobile])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <nav className="h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-6 flex-1 justify-between">
          {isMobile && (
            // Use toggleMobileMenu prop in onClick
            <Button variant="ghost" size="icon" className="mr-2" onClick={toggleMobileMenu}>
              {/* Use isMobileMenuOpen prop for icon */} 
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          )}

          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="block md:hidden">
              <Image 
                src="/image.png"
                alt="Vidiony Mobile Logo" 
                width={40} 
                height={40} 
                className="w-[70px] h-[70px] object-contain"
                priority 
              />
            </div>
            <div className="hidden md:block">
              <Image 
                src="/image-removebg-preview.png" 
                alt="Vidiony Logo" 
                width={200} 
                height={40} 
                className="w-[100px] sm:w-[100px] md:w-[120px] lg:w-[120px] h-auto object-contain"
                priority 
              />
            </div>
          </Link>

          <div className="flex items-center gap-4 w-full justify-center">
            <SearchBar className="w-full" />
          </div>
          <ThemeToggle />
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
