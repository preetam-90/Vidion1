import { Card, CardHeader } from '@/components/ui/card'

export default function VideoCardSkeleton() {
  return (
    <Card className="w-full overflow-hidden rounded-lg shadow-sm">
      <div className="relative aspect-video w-full bg-muted/60 animate-pulse rounded-t-lg"></div>
      <CardHeader className="p-4">
        <div className="h-4 bg-muted/60 animate-pulse rounded-md w-full mb-2"></div>
        <div className="h-3 bg-muted/60 animate-pulse rounded-md w-3/4"></div>
      </CardHeader>
    </Card>
  )
} 