import { Video } from '@/data'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Image from 'next/image'

export default function VideoCard({ video, onClick }: { video: Video; onClick?: () => void }) {
  return (
    <Card className="w-full max-w-sm overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-md" onClick={onClick}>
      <div className="relative aspect-video w-full">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFeAJ5jm5OgAAAAABJRU5ErkJggg=="
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-2 text-sm font-medium">{video.title}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          {video.uploader} • {video.views} views • {video.uploadDate}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}