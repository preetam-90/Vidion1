import React from 'react';
import Link from 'next/link';
import { YouTubeVideo } from '@/lib/youtube-api';

interface NewsVideoCardProps {
  video: YouTubeVideo;
}

const NewsVideoCard: React.FC<NewsVideoCardProps> = ({ video }) => {
  // Format the published date
  const formattedDate = video.snippet.publishedAt ?
    new Date(video.snippet.publishedAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }) : '';

  // Convert view count to a readable format
  const formatViewCount = (viewCount: string) => {
    const count = parseInt(viewCount, 10);
    if (isNaN(count)) return '';

    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M views';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K views';
    }
    return count + ' views';
  };

  return (
    <Link href={`/video/${video.id}`} className="block group">
      <div className="relative">
        <img
          src={video.snippet.thumbnails.high.url}
          alt={video.snippet.title}
          className="w-full h-auto rounded-lg"
          loading="lazy"
        />
      </div>
      <div className="mt-2">
        <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-red-500">
          {video.snippet.title}
        </h3>
        <p className="text-sm text-gray-400 mt-1">{video.snippet.channelTitle}</p>
        <div className="flex items-center text-xs text-gray-400 mt-1 space-x-2">
          {video.statistics?.viewCount ? (
            <span>{formatViewCount(video.statistics.viewCount)}</span>
          ) : null}
          {formattedDate && (
            <>
              <span>•</span>
              <span>{formattedDate}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default NewsVideoCard;