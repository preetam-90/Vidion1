"use client"

import React from "react"
import VideoCard from '@/components/video-card'
import { videos } from '@/data'

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6 pb-20 container mx-auto px-4 md:px-6">
      <div className="mt-6">
        <h1 className="text-3xl font-bold">Home</h1>
        <p className="text-muted-foreground mt-1">Discover new videos from our collection</p>
      </div>

      {/* Main Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {videos.map((video, index) => (
          <VideoCard key={video.id} video={video} index={index} onClick={() => {
            sessionStorage.setItem('currentVideo', JSON.stringify(video));
            window.location.href = `/player/${video.id}`;
          }} />
        ))}
      </div>
    </div>
  )
}