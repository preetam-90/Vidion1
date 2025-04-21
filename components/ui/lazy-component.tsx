"use client";

import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LazyComponentProps {
  children: ReactNode;
  className?: string;
  placeholder?: ReactNode;
  rootMargin?: string;
  threshold?: number;
  once?: boolean;
}

export function LazyComponent({
  children,
  className,
  placeholder,
  rootMargin = "0px",
  threshold = 0,
  once = true,
  ...props
}: LazyComponentProps & Omit<React.HTMLAttributes<HTMLElement>, "children">) {
  const [containerRef, isInView] = useIntersectionObserver<HTMLDivElement>(
    { rootMargin, threshold },
    once
  );

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      {...props}
    >
      {isInView ? children : placeholder || <div className="w-full h-full bg-muted animate-pulse" />}
    </div>
  );
} 