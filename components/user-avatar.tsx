"use client";

import { useUser } from "@stackframe/stack";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  fallbackClassName?: string;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10", 
  lg: "h-16 w-16",
  xl: "h-20 w-20"
};

export default function UserAvatar({ 
  className, 
  size = "md", 
  fallbackClassName
}: UserAvatarProps) {
  const user = useUser();

  if (!user) {
    return null;
  }

  const fallbackText = user.displayName 
    ? user.displayName.charAt(0).toUpperCase() 
    : user.primaryEmail?.charAt(0).toUpperCase() || "U";

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage 
        src={user.profileImageUrl ? `/api/proxy/image?url=${encodeURIComponent(user.profileImageUrl)}` : undefined}
        alt={user.displayName || "User Avatar"}
      />
      <AvatarFallback className={cn("text-sm font-medium", fallbackClassName)}>
        {fallbackText}
      </AvatarFallback>
    </Avatar>
  );
}
