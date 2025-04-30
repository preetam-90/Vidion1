import { Video } from '@/data'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Image from 'next/image'

export default function VideoCard({ video, onClick }: { video: Video; onClick?: () => void }) {
  // Format view count to display in K, M, or B format
  const formatViewCount = () => {
    try {
      // Get the view count from the video object
      let count = video.views;
      
      // If it's a string that already contains "views", return it as is
      if (typeof count === 'string' && count.includes('view')) {
        return count;
      }
      
      // Convert to number if it's a string
      const numViews = typeof count === 'string' ? parseInt(count.replace(/[^0-9]/g, '')) : Number(count);
      
      // Format based on magnitude
      if (isNaN(numViews)) return "0 views";
      if (numViews >= 1000000000) return `${(numViews / 1000000000).toFixed(1).replace(/\.0$/, '')}B views`;
      if (numViews >= 1000000) return `${(numViews / 1000000).toFixed(1).replace(/\.0$/, '')}M views`;
      if (numViews >= 1000) return `${(numViews / 1000).toFixed(1).replace(/\.0$/, '')}K views`;
      return `${numViews} views`;
    } catch (err) {
      console.error("Error formatting view count:", err);
      return "0 views";
    }
  };

  return (
    <Card className="w-full overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-md cursor-pointer" onClick={onClick}>
      <div className="relative aspect-video w-full">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFeAJ5jm5OgAAAAABJRU5ErkJggg=="
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
        />
      </div>
      <CardHeader className="p-2 sm:p-3">
        <CardTitle className="line-clamp-2 text-xs sm:text-sm font-medium">{video.title}</CardTitle>
        <CardDescription className="text-[10px] sm:text-xs text-muted-foreground">
          {video.uploader} • {formatViewCount()} • {video.uploadDate}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}