"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Video } from '@/types/data';
import { Button } from '@/components/ui/button';
import { Heart, Clock, MoreVertical, Play, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface PremiumVideoCardProps {
  video: Video;
  layout?: 'grid' | 'list';
  context?: 'favorites' | 'liked-videos' | 'default';
  onRemove?: (id: string | number) => void;
}

export function PremiumVideoCard({ 
  video, 
  layout = 'grid', 
  context = 'default',
  onRemove 
}: PremiumVideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onRemove) {
      onRemove(video.id);
      toast({
        description: "Removed from favorites",
        className: "bg-destructive text-destructive-foreground",
      });
    }
  };

  if (layout === 'list') {
    return (
      <Link 
        href={`/video/${video.id}`}
        className="block group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          className={cn(
            "flex gap-4 p-4 rounded-2xl transition-all duration-300",
            "bg-background/70 backdrop-blur-lg border border-border/30",
            "hover:bg-background/90 hover:shadow-lg",
            (context === 'favorites' || context === 'liked-videos') && "bg-primary/5 hover:bg-primary/10"
          )}
          whileHover={{ y: -2 }}
        >
          <div className="relative flex-shrink-0 w-48 rounded-xl overflow-hidden">
            <Image
              src={video.thumbnail || '/placeholder-thumbnail.jpg'}
              alt={video.title}
              width={192}
              height={108}
              className="aspect-video object-cover w-full"
              unoptimized={true}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-2 left-2 text-sm text-primary-foreground flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {video.duration}
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-lg line-clamp-2">{video.title}</h3>
              <p className="text-muted-foreground text-sm mt-1">{video.uploader}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                  {video.category}
                </span>
                <span className="text-xs text-muted-foreground">
                  {video.views} views
                </span>
              </div>
            </div>

            {(context === 'favorites' || context === 'liked-videos') && (
              <div className="flex items-center justify-between mt-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={handleRemove}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
                <Button size="sm" className="rounded-full px-6">
                  <Play className="h-4 w-4 mr-2" />
                  Play
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link 
      href={`/video/${video.id}`}
      className="block group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className={cn(
          "relative rounded-2xl overflow-hidden transition-all duration-300",
          "bg-background/70 backdrop-blur-lg border border-border/30",
          "hover:shadow-xl hover:border-primary/30",
          (context === 'favorites' || context === 'liked-videos') && "bg-primary/5 hover:bg-primary/10"
        )}
        whileHover={{ y: -5 }}
      >
        <div className="relative aspect-video">
          <Image
            src={video.thumbnail || '/placeholder-thumbnail.jpg'}
            alt={video.title}
            fill
            className="object-cover"
            unoptimized={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-2 left-2 text-sm text-primary-foreground flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {video.duration}
          </div>
          {isClient && isHovered && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Button 
                size="lg" 
                className="rounded-full px-6 backdrop-blur-md bg-background/30 hover:bg-background/50"
              >
                <Play className="h-5 w-5 mr-2" />
                Play Now
              </Button>
            </motion.div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h3 className="font-semibold line-clamp-2">{video.title}</h3>
              <p className="text-muted-foreground text-sm mt-1">{video.uploader}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                  {video.category}
                </span>
                <span className="text-xs text-muted-foreground">
                  {video.views} views
                </span>
              </div>
            </div>

            {(context === 'favorites' || context === 'liked-videos') && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:bg-background"
                    onClick={(e) => e.preventDefault()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    className="text-destructive focus:bg-destructive/10"
                    onClick={handleRemove}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {context === 'favorites' ? 'Remove from Favorites' : 'Remove from Liked Videos'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
