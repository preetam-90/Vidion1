"use client"

import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { WatchLaterProvider } from "@/contexts/watch-later-context"
import { LikedVideosProvider } from "@/contexts/liked-videos-context"
import { useState, Suspense } from "react"
import { Toaster } from "@/components/ui/sonner"
import dynamic from "next/dynamic"

// Dynamically import Navbar and Sidebar for better code splitting
const Navbar = dynamic(() => import("@/components/navbar"), {
  ssr: true,
  loading: () => <div className="h-16 w-full bg-background border-b"></div>
})

const Sidebar = dynamic(() => import("@/components/sidebar"), {
  ssr: false,
  loading: () => (
    <div className="hidden md:block w-64 h-full bg-background border-r animate-pulse"></div>
  )
})

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isMobileMenuOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />
      <div className="flex flex-1 pt-16">
        <Suspense fallback={<div className="w-64 h-full bg-background border-r"></div>}>
          <Sidebar isMobileMenuOpen={isMobileMenuOpen} closeMobileMenu={closeMobileMenu} />
        </Suspense>
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