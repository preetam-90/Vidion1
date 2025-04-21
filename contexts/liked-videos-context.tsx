"use client"

import { createContext, useContext, useState, useEffect } from "react"
import type { Video } from "@/data"

interface LikedVideosContextType {
  likedVideos: Video[]
  addToLiked: (video: Video) => void
  removeFromLiked: (videoId: string | number) => void
  isLiked: (videoId: string | number) => boolean
  updateLikedOrder: (newOrder: Video[]) => void
}

const LikedVideosContext = createContext<LikedVideosContextType | undefined>(undefined)

export function LikedVideosProvider({ children }: { children: React.ReactNode }) {
  const [likedVideos, setLikedVideos] = useState<Video[]>([])

  // Load liked videos from localStorage on mount
  useEffect(() => {
    const savedVideos = localStorage.getItem("likedVideos")
    if (savedVideos) {
      try {
        setLikedVideos(JSON.parse(savedVideos))
      } catch (error) {
        console.error("Error loading liked videos:", error)
      }
    }
  }, [])

  // Save to localStorage whenever likedVideos changes
  useEffect(() => {
    localStorage.setItem("likedVideos", JSON.stringify(likedVideos))
  }, [likedVideos])

  const addToLiked = (video: Video) => {
    setLikedVideos(prev => {
      if (prev.some(v => v.id === video.id)) {
        return prev
      }
      const newList = [video, ...prev]
      localStorage.setItem("likedVideos", JSON.stringify(newList))
      return newList
    })
  }

  const removeFromLiked = (videoId: string | number) => {
    setLikedVideos(prev => {
      const newList = prev.filter(video => video.id !== videoId)
      localStorage.setItem("likedVideos", JSON.stringify(newList))
      return newList
    })
  }

  const isLiked = (videoId: string | number) => {
    return likedVideos.some(video => video.id === videoId)
  }

  const updateLikedOrder = (newOrder: Video[]) => {
    setLikedVideos(newOrder)
    localStorage.setItem("likedVideos", JSON.stringify(newOrder))
  }

  return (
    <LikedVideosContext.Provider 
      value={{ 
        likedVideos, 
        addToLiked, 
        removeFromLiked, 
        isLiked,
        updateLikedOrder
      }}
    >
      {children}
    </LikedVideosContext.Provider>
  )
}

export function useLikedVideos() {
  const context = useContext(LikedVideosContext)
  if (context === undefined) {
    throw new Error("useLikedVideos must be used within a LikedVideosProvider")
  }
  return context
} 