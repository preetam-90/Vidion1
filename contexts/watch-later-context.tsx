"use client"

import { createContext, useContext, useState, useEffect } from "react"
import type { Video } from "@/data"

interface WatchLaterContextType {
  watchLaterVideos: Video[]
  addToWatchLater: (video: Video) => void
  removeFromWatchLater: (videoId: string | number) => void
  isInWatchLater: (videoId: string | number) => boolean
  updateWatchLaterOrder: (newOrder: Video[]) => void
}

const WatchLaterContext = createContext<WatchLaterContextType | undefined>(undefined)

export function WatchLaterProvider({ children }: { children: React.ReactNode }) {
  const [watchLaterVideos, setWatchLaterVideos] = useState<Video[]>([])

  // Load watch later videos from localStorage on mount
  useEffect(() => {
    const savedVideos = localStorage.getItem("watchLater")
    if (savedVideos) {
      try {
        const parsedVideos = JSON.parse(savedVideos)
        setWatchLaterVideos(Array.isArray(parsedVideos) ? parsedVideos : [])
      } catch (error) {
        console.error("Error loading watch later videos:", error)
        setWatchLaterVideos([])
      }
    }
  }, [])

  // Save to localStorage whenever watchLaterVideos changes
  useEffect(() => {
    localStorage.setItem("watchLater", JSON.stringify(watchLaterVideos))
  }, [watchLaterVideos])

  const addToWatchLater = (video: Video) => {
    setWatchLaterVideos(prev => {
      if (prev.some(v => v.id === video.id)) {
        return prev
      }
      const newList = [video, ...prev]
      localStorage.setItem("watchLater", JSON.stringify(newList))
      return newList
    })
  }

  const removeFromWatchLater = (videoId: string | number) => {
    setWatchLaterVideos(prev => {
      const newList = prev.filter(video => video.id !== videoId)
      localStorage.setItem("watchLater", JSON.stringify(newList))
      return newList
    })
  }

  const isInWatchLater = (videoId: string | number) => {
    return watchLaterVideos.some(video => video.id === videoId)
  }

  const updateWatchLaterOrder = (newOrder: Video[]) => {
    setWatchLaterVideos(newOrder)
    localStorage.setItem("watchLater", JSON.stringify(newOrder))
  }

  return (
    <WatchLaterContext.Provider 
      value={{ 
        watchLaterVideos, 
        addToWatchLater, 
        removeFromWatchLater, 
        isInWatchLater,
        updateWatchLaterOrder
      }}
    >
      {children}
    </WatchLaterContext.Provider>
  )
}

export function useWatchLater() {
  const context = useContext(WatchLaterContext)
  if (context === undefined) {
    throw new Error("useWatchLater must be used within a WatchLaterProvider")
  }
  return context
}