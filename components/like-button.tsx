"use client";

import { useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui Button
import { cn } from '@/lib/utils'; // Assuming shadcn/ui utility

interface LikeButtonProps {
  initialLiked: boolean;
  videoId: string; // Needed to make API calls
  onLikeToggle: (videoId: string, isLiked: boolean) => Promise<boolean>; // Function to call API
  // Add other props like size, className if needed
}

export default function LikeButton({ 
  initialLiked, 
  videoId, 
  onLikeToggle 
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setIsAnimating(true);
    
    const newLikedState = !isLiked;

    try {
      const success = await onLikeToggle(videoId, newLikedState);
      
      if (success) {
        setIsLiked(newLikedState);
      } else {
        setIsAnimating(false);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      setIsAnimating(false);
    } finally {
      setIsLoading(false);
    }

    // Remove animation class after a short delay
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  return (
    <Button
      variant="outline" // Or adjust as needed
      size="icon" // Or adjust as needed
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        "transition-colors duration-200 ease-in-out cursor-pointer",
        isLiked ? "text-blue-500 border-blue-500 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900/20" : "text-muted-foreground hover:text-foreground",
        isAnimating ? "animate-like-bounce" : "",
        isLoading ? "opacity-50" : "opacity-100"
      )}
      aria-pressed={isLiked}
      aria-label={isLiked ? "Unlike" : "Like"}
    >
      <ThumbsUp 
         className={cn(
            "h-5 w-5", // Adjust size as needed
            isLiked ? "fill-current" : "fill-none"
         )} 
      />
    </Button>
  );
}

// Add this keyframes animation to your global CSS (e.g., app/globals.css)
/*
@keyframes like-bounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
}
.animate-like-bounce {
  animation: like-bounce 0.3s ease-in-out;
}
*/ 