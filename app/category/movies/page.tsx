"use client"

import { useState, useEffect } from "react"
import ClientOnly from "@/components/client-only"
import Sidebar from "@/components/sidebar"
import './movies.css'

export default function MoviesPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showPopup, setShowPopup] = useState(true)
  const [showError, setShowError] = useState(false)

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  // Function to open donkey.to in a new tab
  const openInNewTab = () => {
    window.open("https://bhaiflix.vercel.app", "_blank")
  }

  // Hide popup after a few seconds
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false)
      }, 6800)
      return () => clearTimeout(timer)
    }
  }, [showPopup])

  // Apply full-screen layout styles and modify sidebar
  useEffect(() => {
    // Get the navbar element
    const navbar = document.querySelector('nav') || document.querySelector('header')
    
    // Hide the navbar
    if (navbar instanceof HTMLElement) {
      navbar.style.display = 'none'
    }
    
    // Make container full screen
    const mainElement = document.querySelector('main')
    if (mainElement instanceof HTMLElement) {
      mainElement.style.paddingTop = '0'
      mainElement.style.margin = '0'
      mainElement.style.height = '100vh'
      mainElement.style.width = '100vw'
      mainElement.style.maxWidth = '100vw'
      mainElement.style.overflow = 'hidden'
    }

    // Style the sidebar for the movies page
    const sidebarElement = document.querySelector('aside')
    let profileSection: HTMLElement | null = null;

    if (sidebarElement instanceof HTMLElement) {
      // Add the movies-specific class
      sidebarElement.classList.add('movies-sidebar')
      
      // Direct styling for glass effect
      sidebarElement.style.backgroundColor = 'rgba(20, 20, 20, 0.6)'
      sidebarElement.style.backdropFilter = 'blur(15px)'
      sidebarElement.style.setProperty('-webkit-backdrop-filter', 'blur(15px)')
      sidebarElement.style.borderRadius = '16px'
      sidebarElement.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)'
      sidebarElement.style.border = '1px solid rgba(255, 255, 255, 0.08)'
      
      // Add centering class to sidebar items (buttons and links)
      const sidebarItems = sidebarElement.querySelectorAll('a, button')
      sidebarItems.forEach(item => {
        if (item instanceof HTMLElement) {
          // Add class only if it's likely a main icon link/button
          if(item.closest('.space-y-1')) {
             item.classList.add('centered-item')
          }
        }
      })

      // Find and add a specific class to the profile section for CSS targeting
      profileSection = sidebarElement.querySelector('[class*="border-t"][class*="pt-2"][class*="pb-3"]');
      if (profileSection instanceof HTMLElement) {
        profileSection.classList.add('user-profile-section');
      }
    }
    
    // Clean up when component unmounts
    return () => {
      if (navbar instanceof HTMLElement) {
        navbar.style.display = ''
      }
      if (mainElement instanceof HTMLElement) {
        mainElement.style.paddingTop = ''
        mainElement.style.margin = ''
        mainElement.style.height = ''
        mainElement.style.width = ''
        mainElement.style.maxWidth = ''
        mainElement.style.overflow = ''
      }
      if (sidebarElement instanceof HTMLElement) {
        sidebarElement.classList.remove('movies-sidebar')
        
        const sidebarItems = sidebarElement.querySelectorAll('.centered-item')
        sidebarItems.forEach(item => {
          if (item instanceof HTMLElement) {
            item.classList.remove('centered-item')
          }
        })

        // Remove the specific class from profile section if it exists
        if (profileSection instanceof HTMLElement) {
           profileSection.classList.remove('user-profile-section');
        }
      }
    }
  }, [])

  return (
    <>
      {/* Popup notification */}
      <ClientOnly>
        {showPopup && (
          <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-[100] bg-black bg-opacity-80 text-white rounded-lg shadow-lg px-6 py-4 flex flex-col items-center animate-fade-in">
            <p className="mb-3 text-center">Watch your favorite movies in a new tab</p>
            <button 
              onClick={openInNewTab} 
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Open in new tab
            </button>
          </div>
        )}
      </ClientOnly>

      {/* Custom sidebar implementation with overlay functionality */}
      <div className="movies-sidebar-wrapper">
        <ClientOnly>
          <Sidebar 
            isMobileMenuOpen={isMobileMenuOpen}
            closeMobileMenu={closeMobileMenu}
            toggleMobileMenu={toggleMobileMenu}
            shouldOverlay={true}
          />
        </ClientOnly>
      </div>

      {/* Movies content container */}
      <div 
        id="movies-container" 
        className="w-full h-full bg-black"
      >
        <ClientOnly>
          {showError ? (
            <div className="flex flex-col items-center justify-center h-full text-white p-8">
              <h2 className="text-2xl font-bold mb-4">Video player unavailable</h2>
              <p className="mb-6 text-center max-w-md">We're having trouble loading the video player. Please try opening it in a new tab instead.</p>
              <button 
                onClick={openInNewTab}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Open in new tab
              </button>
            </div>
          ) : (
            <div style={{ width: '100%', height: '100%' }}>
              <object
                data="https://donkey.to"
                type="text/html"
                width="100%"
                height="100%"
                onError={() => setShowError(true)}
                style={{ width: '100%', height: '100%', border: 0 }}
              >
                <div className="flex flex-col items-center justify-center h-full text-white">
                  <p>Unable to load content.</p>
                  <button 
                    onClick={openInNewTab}
                    className="mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    Open in new tab
                  </button>
                </div>
              </object>
            </div>
          )}
        </ClientOnly>
      </div>
    </>
  )
}
