import * as React from "react"
import { cn } from "@/lib/utils"

interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const SidebarContent = React.forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex h-full w-full flex-col", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

SidebarContent.displayName = "SidebarContent"

export { SidebarContent } 