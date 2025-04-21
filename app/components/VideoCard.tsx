import { Video } from '@/data'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import Image from 'next/image'

export default function VideoCard({ video }: { video: Video }) {
  return (
    <Card className="w-full max-w-sm overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-md">
      <div className="relative aspect-video w-full">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
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
      <CardContent className="text-xs text-muted-foreground">
        <p className="line-clamp-2">{video.description}</p>
      </CardContent>
    </Card>
  )
}