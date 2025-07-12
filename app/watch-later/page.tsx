"use client"

import { useWatchLater } from "@/contexts/watch-later-context"
import { usePageTitle } from "@/hooks/usePageTitle"
import { Video } from "@/types/data"
import { motion } from "framer-motion"
import Image from "next/image"
import { useEffect, useState } from "react"
import { getBestThumbnailUrl, handleThumbnailError } from "@/lib/thumbnail-utils"

export default function WatchLaterPage() {
  usePageTitle("Watch Later")
  const { watchLaterVideos, removeFromWatchLater } = useWatchLater()
  const [filteredVideos, setFilteredVideos] = useState<Video[]>(watchLaterVideos)

  useEffect(() => {
    setFilteredVideos(watchLaterVideos)
  }, [watchLaterVideos])

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF0000] to-[#9146FF]">
            Watch Later
          </h1>
          <span className="text-gray-400 text-sm">
            {filteredVideos.length} {filteredVideos.length === 1 ? 'video' : 'videos'}
          </span>
        </div>

        {filteredVideos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="mb-6">
              <Image
                src="/placeholder-thumbnail.jpg"
                alt="Empty Watch Later"
                width={300}
                height={300}
                className="opacity-80"
              />
            </div>
            <h2 className="text-2xl font-medium text-gray-200 mb-2">Your Watch Later is empty</h2>
            <p className="text-gray-400 max-w-md">
              Save videos to watch later by clicking the "Watch Later" button on any video page.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredVideos.map((video) => (
              <motion.div
                key={video.id}
                className="group relative bg-[#181818] rounded-xl overflow-hidden hover:bg-[#222222] transition-all duration-200"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative aspect-video">
                  <Image
                    src={getBestThumbnailUrl(video)}
                    alt={video.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={false}
                    onError={(e) => handleThumbnailError(e, video)}
                  />
                  <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-1 rounded text-xs font-medium text-white">
                    {video.duration || '10:30'}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </div>
                
                <div className="p-3">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-9 h-9 rounded-full bg-gray-600 flex items-center justify-center">
                        <span className="text-xs font-medium text-white">
                          {video.uploader?.[0] || 'C'}
                        </span>
                      </div>
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-medium text-gray-100 line-clamp-2 text-sm leading-tight">
                        {video.title}
                      </h3>
                      <p className="text-gray-400 text-xs mt-1 truncate">
                        {video.uploader}
                      </p>
                      <div className="flex items-center text-gray-400 text-xs mt-1">
                        <span>{typeof video.views === 'number' ? `${video.views.toLocaleString()} views` : video.views}</span>
                        <span className="mx-1">•</span>
                        <span>{new Date(video.uploadDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeFromWatchLater(video.id)}
                  className="absolute top-2 right-2 p-2 bg-black/70 rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Remove from Watch Later"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}