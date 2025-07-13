import { Video } from "@/data";
import { useRouter } from "next/navigation";
import Image from "next/image"; 
import { formatDistanceToNow } from "date-fns";

interface WatchRecommendedVideosProps {
  videos: Video[];
}

export default function WatchRecommendedVideos({ videos }: WatchRecommendedVideosProps) {
  const router = useRouter();

  const formatViews = (views: number | string) => {
    const viewCount = typeof views === 'string' 
      ? parseInt(views.replace(/[^0-9]/g, ''), 10) 
      : views;
    
    if (viewCount >= 1000000) {
      return `${(viewCount / 1000000).toFixed(1)}M views`;
    } else if (viewCount >= 1000) {
      return `${(viewCount / 1000).toFixed(1)}K views`;
    }
    return `${viewCount} views`;
  };
  
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return dateString;
    }
  };

  const handleClick = (video: Video) => {
    // Store the current video info in session storage for quick access
    sessionStorage.setItem('currentVideo', JSON.stringify({
      id: video.id,
      title: video.title,
      platform: video.platform || 'youtube',
      url: video.url,
      channelTitle: video.uploader,
      viewCount: formatViews(video.views || 0),
      publishedAt: video.uploadDate
    }));
    
    // Navigate to video page
    router.push(`/watch?v=${video.id}`);
  };

  return (
    <div className="space-y-2">
      <h3 className="text-md font-medium mb-3">Recommended videos</h3>
      {videos.map((video) => (
        <div 
          key={video.id} 
          className="flex gap-2 mb-3 cursor-pointer hover:bg-muted/30 rounded-md p-1 transition-colors"
          onClick={() => handleClick(video)}
        >
          <div className="relative flex-shrink-0 w-[140px] h-[80px] rounded-md overflow-hidden">
            <Image
              src={video.thumbnail || '/placeholder-video.jpg'}
              alt={video.title}
              fill
              className="object-cover"
              sizes="140px"
            />
            {video.duration && (
              <div className="absolute bottom-1 right-1 bg-black/80 px-1 rounded text-xs text-white">
                {video.duration}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium line-clamp-2">{video.title}</h4>
            {video.uploader && (
              <p className="text-xs text-muted-foreground mt-1">
                {video.uploader}
              </p>
            )}
            <div className="flex text-xs text-muted-foreground mt-0.5">
              {video.views && (
                <span className="inline-block">{formatViews(video.views)}</span>
              )}
              {video.views && video.uploadDate && (
                <span className="mx-1">•</span>
              )}
              {video.uploadDate && (
                <span className="inline-block">{formatDate(video.uploadDate)}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 