import type { Video } from "@/data"
import VideoCard from "@/components/video-card"

interface RecommendedVideosProps {
  videos: Video[]
}

export default function RecommendedVideos({ videos }: RecommendedVideosProps) {
  return (
    <div className="space-y-4">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} layout="list" />
      ))}
    </div>
  )
}
