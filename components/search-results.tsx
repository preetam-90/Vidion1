import type { Video } from "@/data"
import VideoCard from "@/components/video-card"

interface SearchResultsProps {
  videos: Video[]
  query: string
}

export default function SearchResults({ videos, query }: SearchResultsProps) {
  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">No results found</h2>
        <p className="text-muted-foreground">Try different keywords or check your spelling</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 scrollbar-hide">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} layout="list" />
      ))}
    </div>
  )
}
