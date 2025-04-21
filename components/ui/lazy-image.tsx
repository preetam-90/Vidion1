"use client";

import Image from "next/image";
import { useState } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  fallbackSrc?: string;
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  priority = false,
  fallbackSrc = "https://th.bing.com/th/id/OIP.JdK_G0MCX0B6ELApXVkeVAHaE6?rs=1&pid=ImgDetMain",
  ...props
}: LazyImageProps & Omit<React.HTMLAttributes<HTMLElement>, "src" | "width" | "height" | "alt">) {
  const [imgRef, isInView] = useIntersectionObserver<HTMLDivElement>({
    rootMargin: "200px", // Load images 200px before they come into view
    threshold: 0,
  }, true);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Detect Google Drive or non-direct image URLs
  const isGoogleDrive = typeof src === "string" && src.startsWith("https://drive.google.com");
  const isInvalidSrc = isGoogleDrive || !src || src.trim() === "";
  const effectiveSrc = isInvalidSrc && fallbackSrc ? fallbackSrc : src;

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
    if (typeof window !== 'undefined') {
      // Log error for debugging
      // eslint-disable-next-line no-console
      console.error('Failed to load image:', src);
      // Add fallback behavior
      // You can add a default image or any other fallback logic here
      // For example, setting a default image source
      // img.src = '/path/to/default-image.jpg';
    }
  };

  return (
    <div 
      ref={imgRef} 
      className={cn("relative overflow-hidden", className)}
      style={fill ? { width: "100%", height: "100%" } : {}}
      {...props}
    >
      {(isInView || priority) && (
        <Image
          src={error && fallbackSrc ? fallbackSrc : effectiveSrc}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          className={cn(
            "transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
            error && fallbackSrc ? "bg-muted border-2 border-dashed border-red-500" : ""
          )}
          onLoad={handleLoad}
          onError={handleError}
          priority={priority}
        />
      )}
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
          {error && fallbackSrc ? (
            <span className="text-xs text-red-500">No Thumbnail</span>
          ) : null}
        </div>
      )}
    </div>
  );
}