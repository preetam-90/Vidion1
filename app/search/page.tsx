"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { videos } from "@/data"
import SearchResults from "@/components/search-results"
import { searchVideos, convertYouTubeVideoToVideo } from "@/lib/youtube-api"
import type { Video } from "@/data"
import { Loader2, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const sortParam = searchParams.get("sort") || "relevance"

  const [filteredVideos, setFilteredVideos] = useState<Video[]>([])
  const [sort, setSort] = useState(sortParam)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showYouTube, setShowYouTube] = useState(false)
  const [youtubeResults, setYoutubeResults] = useState<Video[]>([])
  const [localResults, setLocalResults] = useState<Video[]>([])
  const [loadingYoutube, setLoadingYoutube] = useState(false)
  const [autoShowedYoutube, setAutoShowedYoutube] = useState(false)

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true)
      setError(null)

      try {
        // First filter local videos from data.ts and prefix their IDs with 'local-'
        const localResults = videos.filter(
          (video) =>
            video.title.toLowerCase().includes(query.toLowerCase()) ||
            video.description.toLowerCase().includes(query.toLowerCase()) ||
            video.uploader.toLowerCase().includes(query.toLowerCase()),
        ).map(video => ({
          ...video,
          id: `local-${video.id}` // Prefix local video IDs to make them unique
        }))

        setLocalResults(localResults)
        
        // If no local results or very few relevant results, automatically fetch from YouTube
        if (localResults.length === 0 || (localResults.length < 3 && query.length > 2)) {
          setShowYouTube(true)
          setAutoShowedYoutube(true)
          await fetchYouTubeResults()
          return
        }

        setFilteredVideos(localResults)
      } catch (error) {
        console.error("Error fetching videos:", error)
        setError("An error occurred while fetching videos. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [query, sort])

  const fetchYouTubeResults = async () => {
    if (!query) return

    setLoadingYoutube(true)
    try {
      const ytVideos = await searchVideos(query)
      const results = ytVideos.map(convertYouTubeVideoToVideo)
      setYoutubeResults(results)
      
      // Combine results if showYouTube is true
      if (showYouTube) {
        setFilteredVideos([...localResults, ...results])
      }
    } catch (error) {
      console.error("Error searching YouTube videos:", error)
      setError("Failed to fetch YouTube videos. Showing local results only.")
      setShowYouTube(false)
      setFilteredVideos(localResults)
    } finally {
      setLoadingYoutube(false)
    }
  }

  const handleYouTubeToggle = async () => {
    const newShowYouTube = !showYouTube
    setShowYouTube(newShowYouTube)
    if (newShowYouTube) {
      if (youtubeResults.length === 0) {
        await fetchYouTubeResults()
      } else {
        setFilteredVideos([...localResults, ...youtubeResults])
      }
    } else {
      setFilteredVideos(localResults)
    }
  }

  const handleSortChange = (newSort: string) => {
    setSort(newSort)
    
    let results = [...filteredVideos]
    
    // Helper function to parse numeric values
    const parseNumericValue = (value: string | number) => {
      if (typeof value === "string") {
        // Remove any non-numeric characters (except decimal points)
        const cleanValue = value.replace(/[^0-9.]/g, '')
        return Number.parseFloat(cleanValue) || 0
      }
      return value || 0
    }
    
    // Sort videos based on the sort parameter
    switch (newSort) {
      case "date":
        results = results.sort((a, b) => {
          const dateA = new Date(a.uploadDate).getTime()
          const dateB = new Date(b.uploadDate).getTime()
          return dateB - dateA // Most recent first
        })
        break
      case "views":
        results = results.sort((a, b) => {
          const aViews = parseNumericValue(a.views)
          const bViews = parseNumericValue(b.views)
          return bViews - aViews // Most views first
        })
        break
      case "rating":
        results = results.sort((a, b) => {
          const aLikes = parseNumericValue(a.likes)
          const bLikes = parseNumericValue(b.likes)
          return bLikes - aLikes // Most likes first
        })
        break
      case "relevance":
        // For relevance, we want local results first, then YouTube results
        results = [
          ...localResults,
          ...youtubeResults.filter(yt => !localResults.some(local => local.id === yt.id))
        ]
        break
      default:
        // If no valid sort option, maintain current order
        break
    }

    setFilteredVideos(results)

    // Update URL without full page reload
    const url = new URL(window.location.href)
    url.searchParams.set("sort", newSort)
    window.history.pushState({}, "", url.toString())
  }

  // Update useEffect to apply sorting when results change
  useEffect(() => {
    if (sort !== "relevance") {
      handleSortChange(sort)
    }
  }, [localResults, youtubeResults])

  return (
    <div className="container mx-auto px-4 py-6 scrollbar-hide overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 scrollbar-hide">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">{query ? `Search results for "${query}"` : "All Videos"}</h1>
          {query && (localResults.length === 0 || localResults.length > 0) && (
            <Button
              variant={showYouTube ? "default" : "outline"}
              size="sm"
              onClick={handleYouTubeToggle}
              disabled={loadingYoutube}
              className="flex items-center gap-2"
            >
              <Youtube className="h-4 w-4" />
              {showYouTube ? (autoShowedYoutube ? "Hide YouTube Results" : "Hide YouTube Results") : "Show More Results"}
            </Button>
          )}
        </div>
        <div className="flex items-center">
          <span className="mr-2">Sort by:</span>
          <select
            className="bg-background border rounded-md p-2 scrollbar-hide"
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="relevance">Relevance</option>
            <option value="date">Upload Date</option>
            <option value="views">View Count</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-4 scrollbar-hide">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Searching videos...</span>
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex gap-4">
              <div className="relative w-40 h-24 bg-muted rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <SearchResults videos={filteredVideos} query={query} />
          {loadingYoutube && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2">Loading YouTube results...</span>
            </div>
          )}
        </>
      )}
    </div>
  )
}
